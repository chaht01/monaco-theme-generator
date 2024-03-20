import { IconButton, Stack, Typography } from "@mui/material"
import { PopoverPicker } from "./PopoverPicker"
import { colord } from "colord";
import { Refresh } from "@mui/icons-material";

interface ThemeColorEditorProps {
    origin: any
    colors: any
    handleColorChange: (key:string, newValue:string) => void
}

export const ThemeColorEditor = ({ origin, colors, handleColorChange }:ThemeColorEditorProps) => {
    // const originKV:[string, string][] = Object.entries(origin)
    const undo = (key:string) => {
        handleColorChange(key, origin[key])
    }
    return (
        <>
        <Stack spacing={2} sx={{position:'sticky', top: '2rem'}} alignItems={'flex-start'}>
            <Typography variant="h6" fontWeight={800}>Colors</Typography>
            { (Object.entries(colors) as [string, string][]).map(([key, value]) => {
                return (
                <Stack key={key} alignItems={'flex-start'}>
                    <Typography fontWeight={800}>{key}</Typography>
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
            
        </Stack>
        </>
    )
}
