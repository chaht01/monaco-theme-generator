import { useEffect, useState } from 'react'
import './App.css'
import Editor, { useMonaco } from '@monaco-editor/react';
import CTThemeData from './themes/CT.json'
import { ThemeColorEditor } from './ThemeColorEditor';
import { Button, ButtonGroup, Stack, styled } from '@mui/material';
import { ThemeRuleEditor } from './ThemeRuleEditor';
import { files } from './files';

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

function App() {
	const monaco = useMonaco()
	const [origin, setOrigin] = useState(CTThemeData)
	const [localTheme, setLocalTheme] = useState(CTThemeData)
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
					<ThemeColorEditor origin={origin.colors} colors={localTheme.colors} handleColorChange={handleColorChange} />
				</Stack>
				<ThemeRuleEditor origin={origin.rules} rules={localTheme.rules} handleRuleChange={handleRuleChange} />
			</Stack>


		</Stack>
	)
}

export default App
