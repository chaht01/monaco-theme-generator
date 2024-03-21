import { Button, IconButton, Stack, Switch, Typography } from "@mui/material"
import { PopoverPicker } from "./PopoverPicker"
import { colord } from "colord";
import { Refresh } from "@mui/icons-material";
import { Color } from "./App";

interface ThemeColorEditorProps {
    origin: Record<string, Color>
    colors: Record<string, Color>
    handleColorChange: (key:string, newValue:string) => void
    handleActiveChange: (key:string, newValue:boolean) => void
}

export const ThemeColorEditor = ({ origin, colors, handleColorChange, handleActiveChange }:ThemeColorEditorProps) => {
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
            { [...(Object.entries(colors) as [string, Color][])].sort((a:[string, Color], b:[string, Color]) => {
                if (a[1].active) return -1
                if (b[1].active) return 1
                return 0
            })
            .map(([key, value]) => {
                return (
                <Stack key={key} alignItems={'flex-start'} width={'min-content'}>
                    <Typography fontWeight={800}>{key}</Typography> <Switch checked={value.active} onChange={(e) => handleChange(key, e)}/>
                    <Typography variant="caption" textAlign={'left'}>{value.description}</Typography>
                    <Stack direction={'row'} alignItems={'center'}>

                        {value.active ? (
                            <PopoverPicker color={value.color} onChange={(newValue:string) => {
                                const hex = newValue.startsWith("rgba") ? colord(newValue).toHex() : newValue;
                                handleColorChange(key, hex)
                            }}
                                undo={() => undo(key)}
                            />
                        ):null}

                    
                    {origin[key].color != value.color ? (
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
