import { IconButton, Stack, Typography } from "@mui/material"
import { PopoverPicker } from "./PopoverPicker"
import { colord } from "colord";
import { Refresh } from "@mui/icons-material";

interface ThemeRuleEditorProps {
    origin: any
    rules: any
    handleRuleChange: (token: string, newValue: Record<string, string>) => void
}

export const ThemeRuleEditor = ({ origin, rules, handleRuleChange }: ThemeRuleEditorProps) => {

    const undo = (token: string, key: string) => {
        const rule = origin.find((rule: any) => rule.token === token)
        handleRuleChange(token, { [key]: rule[key] })
    }

    return (
        <>
            <Stack spacing={2} alignItems={'flex-start'}>
                <Typography variant="h6" fontWeight={800}>Rules</Typography>
                {rules.map(({ token, foreground, background }: { token: string, foreground?: string, background?: string }) => {
                    return (
                        <Stack key={token} alignItems={'flex-start'}>
                            <Typography fontWeight={800}>{token}</Typography>
                            {foreground && (
                                <>
                                    <Typography variant="caption">foreground</Typography>
                                    <Stack direction={'row'} alignItems={'center'}>
                                        <PopoverPicker color={`#${foreground}`} onChange={(newValue: string) => {
                                            const hex = newValue.startsWith("rgba") ? colord(newValue).toHex() : newValue;
                                            handleRuleChange(token, {
                                                foreground: hex.substring(1)
                                            })
                                        }}
                                            undo={() => undo(token, 'foreground')}
                                        />
                                        {origin.find((rule: any) => rule.token === token)?.foreground != foreground ? (
                                            <IconButton
                                                onClick={() => undo(token, 'foreground')}
                                            >
                                                <Refresh />
                                            </IconButton>
                                        ) : null}
                                    </Stack>

                                </>
                            )}
                            {background && (
                                <>
                                    <Typography variant="caption">background</Typography>
                                    <Stack direction={'row'} alignItems={'center'}>
                                        <PopoverPicker color={`#${background}`} onChange={(newValue: string) => {
                                            const hex = newValue.startsWith("rgba") ? colord(newValue).toHex() : newValue;
                                            handleRuleChange(token, {
                                                background: hex.substring(1)
                                            })
                                        }}
                                            undo={() => undo(token, 'background')}
                                        />
                                        {origin.find((rule: any) => rule.token === token)?.background != background ? (
                                            <IconButton
                                                onClick={() => undo(token, 'background')}
                                            >
                                                <Refresh />
                                            </IconButton>
                                        ) : null}
                                    </Stack>

                                </>
                            )}


                        </Stack>
                    )
                })}

            </Stack>
        </>
    )
}
