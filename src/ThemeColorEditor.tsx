import { Button, IconButton, Stack, Switch, Typography } from "@mui/material"
import { PopoverPicker } from "./PopoverPicker"
import { colord } from "colord";
import { Refresh } from "@mui/icons-material";
import { Color } from "./App";

interface ThemeColorEditorProps {
    origin: any
    colors: any
    additionalColors: any
    activeColorKeys: string[]
    handleColorChange: (key:string, newValue:string) => void
    handleActiveChange: (key:string, newValue:boolean) => void
}

export const ThemeColorEditor = ({ origin, colors, additionalColors, activeColorKeys, handleColorChange, handleActiveChange }:ThemeColorEditorProps) => {

    const undo = (key:string) => {
        handleColorChange(key, origin[key].color)
    }

    const handleChange = (key:string, event: React.ChangeEvent<HTMLInputElement>) => {
        handleActiveChange(key, event.target.checked);
      };

    return (
        <>
        <Stack spacing={2} sx={{position:'sticky', top: '2rem'}} alignItems={'flex-start'}>
            <Typography variant="h6" fontWeight={800}>Colors</Typography>
            { [...(Object.entries(colors) as [string, string][])]
            .map(([key, value]) => {
                return (
                <Stack key={key} alignItems={'flex-start'} width={'min-content'}>
                    <Typography fontWeight={800}>{key}</Typography> 
                    {/* <Typography variant="caption" textAlign={'left'}>{value.description}</Typography> */}
                    <Stack direction={'row'} alignItems={'center'}>
                    <PopoverPicker color={value} onChange={(newValue:string) => {
                                const hex = newValue.startsWith("rgba") ? colord(newValue).toHex() : newValue;
                                handleColorChange(key, hex)
                            }}
                                undo={() => undo(key)}
                            />

                    
                    {origin[key] != value ? (
                        <IconButton
                            onClick={() => undo(key)}
                        >
                            <Refresh/>
                        </IconButton>
                    ):null}
                        
                    </Stack>
                    
                </Stack>
            )})}

            <Typography variant="h6" fontWeight={800}>Additional Colors</Typography>
            { [...(Object.entries(additionalColors) as [string, string][])]
            .map(([key, value]) => {
                const active = activeColorKeys.findIndex(k => k===key)!==-1
                return (
                <Stack key={key} alignItems={'flex-start'} width={'min-content'}>
                    <Typography fontWeight={800}>{key}</Typography> 
                    <Switch checked={active} onChange={(e) => handleChange(key, e)}/>
                    {/* <Typography variant="caption" textAlign={'left'}>{value.description}</Typography> */}
                    <Stack direction={'row'} alignItems={'center'}>
                    {active && (
                        <PopoverPicker color={value} onChange={(newValue:string) => {
                            const hex = newValue.startsWith("rgba") ? colord(newValue).toHex() : newValue;
                            handleColorChange(key, hex)
                        }}
                            undo={() => undo(key)}
                        />
                    )}
                    

                    
                    {origin[key] != value ? (
                        <IconButton
                            onClick={() => undo(key)}
                        >
                            <Refresh/>
                        </IconButton>
                    ):null}
                        
                    </Stack>
                    
                </Stack>
            )})}
            
        </Stack>
        </>
    )
}
