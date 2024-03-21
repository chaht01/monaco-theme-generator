import { useEffect, useState } from 'react'
import './App.css'
import Editor, { useMonaco } from '@monaco-editor/react';
import CTThemeData from './themes/CT.json'
import { ThemeColorEditor } from './ThemeColorEditor';
import { Button, ButtonGroup, Stack, styled } from '@mui/material';
import { ThemeRuleEditor } from './ThemeRuleEditor';
import { files } from './files';
import DefaultColorList from './colorList.json'
import { useDebouncedCallback, useThrottledCallback } from 'use-debounce';

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

export interface Rule {
	token: string
	foreground?: string
	background?: string
	fontStyle?: string
	active?: boolean
}

export interface Color {
	color: string
	description?: string
	active?: boolean
}

export interface ThemeStoreType {
	base: string
	inherit: boolean
	colors: Record<string, Color>
	rules: Rule[]
}

export interface ThemeType {
	base: string
	inherit: boolean
	colors: Record<string, string>
	rules: Rule[]
}

function initThemeStore (theme: ThemeType) {
	const {base, inherit, colors, rules} = theme
	
	const themeStore = {
		base,
		inherit,
		colors: {},
		rules: []
	}

	const keys = Object.keys(DefaultColorList)
	keys.forEach(key => {
		// @ts-ignore
		themeStore.colors[key] = {
			// @ts-ignore
			color: extractHexFromString(DefaultColorList[key]["defaultSnippets"][0]["body"]),
			// @ts-ignore
			description: DefaultColorList[key]["description"],
			active: false
		}
		
	})

	Object.entries(colors).map(([key, value]) => {
		// @ts-ignore
		themeStore.colors[key].color = value
		// @ts-ignore
		themeStore.colors[key].active = true
	})
	// @ts-ignore
	themeStore.rules = rules.map(rule => ({
		...rule,
		active: true
	}))

	return themeStore
}


// function getRemainColors (localTheme:LocalThemeType) {
// 	const keys = Object.keys(DefaultColorList)
// 	const localColors = localTheme.colors
// 	const remains = {}

// 	keys.forEach(key => {
// 		if (localColors[key] === undefined) {
// 			// @ts-ignore
// 			remains[key] = extractHexFromString(DefaultColorList[key]["defaultSnippets"][0]["body"])
// 		}
// 	})
// 	return remains
// }

function extractHexFromString(str:string) {
	const hexRegex = /#[0-9A-Fa-f]{6}/g; // 정규 표현식을 이용하여 hex 문자열을 찾습니다.
	const hexMatches = str.match(hexRegex); // 문자열에서 정규 표현식에 매치되는 부분을 찾습니다.
  
	if (hexMatches) {
	  return hexMatches[0]; // 첫 번째로 매치된 hex 문자열을 반환합니다.
	} else {
	  return null; // 매치되는 hex 문자열이 없을 경우 null을 반환합니다.
	}
  }

function decodeThemeStore (themeStore:ThemeStoreType) {
	const {base, inherit, colors, rules} = themeStore

	const keys = Object.keys(colors)

	const decodedColors = {}

	keys.map(key => {
		if (colors[key].active) {
			// @ts-ignore
			decodedColors[key] = colors[key].color
		}
	})
	
	return {
		base,
		inherit,
		rules: rules.map(rule => {
			const {active, ...rest} = rule
			return {
				...rest
			}
		}),
		colors: decodedColors
	}
}

function App() {
	const monaco = useMonaco()

	const keyList = Object.keys(DefaultColorList)
	// keyList.map(key => {
	// 	// @ts-ignore
	// 	if(!CTThemeData.colors[key]){
	// 		// @ts-ignore
	// 		additionalTheme.colors[key] = extractHexFromString(DefaultColorList[key].defaultSnippets[0].body)
	// 	}
		
	// })

	const [origin, setOrigin] = useState(CTThemeData)
	const [localTheme, setLocalTheme] = useState(CTThemeData)
	const [additionalTheme, setAdditionalTheme] = useState({
		...CTThemeData,
		// @ts-ignore
		colors: keyList.map(key => ([key, extractHexFromString(DefaultColorList[key].defaultSnippets[0].body)])).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
	})
	const [activeColorKeys, setActiveColorKeys] = useState<string[]>([])

	const [fileName, setFileName] = useState<keyof typeof files>('js');

	const handleColorChange = (key: string, newValue: string) => {
		setLocalTheme({
			...localTheme,
			colors: {
				...localTheme.colors,
				[key]: newValue
			}
		})
	}

	const handleActiveChange = (key: string, newValue: boolean) => {
		setActiveColorKeys(prev => newValue ? prev.filter(k =>k !== key).concat(key) : prev.filter(k =>k !== key))
		
	}

	const handleRuleChange = (token: string, newValue: Record<string, string>) => {
		setLocalTheme({
			...localTheme,
			rules: localTheme.rules.map(rule => {
				if (rule.token !== token) {
					return rule
				}
				return {
					...rule,
					...newValue
				}
			})
		})
	}

	const download = () => {
		const element = document.createElement("a");
		const textFile = new Blob([JSON.stringify(localTheme, null, 2)], { type: 'application/json' }); //pass data from localStorage API to blob
		element.href = URL.createObjectURL(textFile);
		element.download = "userFile.json";
		document.body.appendChild(element);
		element.click();
	}

	const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target?.result) {
					const uploaded = JSON.parse(e.target.result.toString())
					const {base, colors, inherit, rules} = uploaded
					setLocalTheme((prev) => ({
						base,
						inherit,
						rules,
						colors: {
							...prev.colors,
							...colors
						}
					}))
					setOrigin((prev) => ({
						base,
						inherit,
						rules,
						colors: {
							...prev.colors,
							...colors
						}
					}))
				}
			};
			reader.readAsText(file);
		}
	};


	useEffect(() => {
		if (monaco && monaco.editor) {
			monaco.editor.defineTheme('ct', localTheme)
			monaco.editor.setTheme('ct')
		}

	}, [monaco, localTheme])


	return (
		<Stack direction={'row'} width={1}>
			<Stack sx={{
				height: '90vh',
				position: 'sticky !important',
				top: '2rem',
			}}>
				<ButtonGroup variant='contained'>
					{Object.keys(files).map(f => (
						<Button key={f} onClick={() => setFileName(f as keyof typeof files)}>
							{f}
						</Button>
					))}
				</ButtonGroup>


				<Editor
					className='monaco'
					height="100%"
					width={'800px'}
					language={files[fileName].language}
					value={files[fileName].value}
					options={{
						minimap: {
							enabled: false,
						},
					}}
				/>
				<Stack py={2} direction={'row'} spacing={1} sx={{
					height: 56
				}}>
					<Button
						component="label"
						role={undefined}
						variant="contained"
						tabIndex={-1}
					>
						Upload file
						<VisuallyHiddenInput type="file" onChange={handleFileInputChange} />
					</Button>

					<Button variant='contained' onClick={download}>Save</Button>
				</Stack>
			</Stack>
			<Stack px={4} direction={'row'} spacing={2}>
				<Stack sx={{ position: 'sticky', top: 10 }}>
					<ThemeColorEditor 
						origin={origin.colors} 
						colors={localTheme.colors} 
						additionalColors={additionalTheme.colors}
						handleColorChange={handleColorChange} 
						activeColorKeys={activeColorKeys}
						handleActiveChange={handleActiveChange}
						/>
				</Stack>
				<ThemeRuleEditor origin={origin.rules} rules={localTheme.rules} handleRuleChange={handleRuleChange} />
			</Stack>


		</Stack>
	)
}

export default App
