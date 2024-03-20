import { useEffect, useMemo, useState } from "react";
import { HexColorInput, RgbaStringColorPicker } from "react-colorful";
import { colord } from "colord";
import { Box, ClickAwayListener, Stack } from "@mui/material";
import { useDebouncedCallback } from 'use-debounce';

interface PopoverPickerProps {
    color: string
    onChange: (newValue: string) => void
    undo: () => void
}

export const PopoverPicker = ({ color, onChange, undo }: PopoverPickerProps) => {
    const [isOpen, toggle] = useState(false);

    const debounced = useDebouncedCallback((value:string) => onChange(value), 10)

    const rgbaString = useMemo(() => {
        return color.startsWith("rgba") ? color : colord(color).toRgbString();
      }, [color]);

    useEffect(() => {
        const escKeyModalClose = (e: KeyboardEvent) => {
            if (e.keyCode === 27) {
                undo();
                toggle(false)
            }
        };
        window.addEventListener("keydown", escKeyModalClose);
        return () => window.removeEventListener("keydown", escKeyModalClose);
    }, [])

    return (
        <ClickAwayListener onClickAway={() => toggle(false)}>
            <Stack direction={'row'} sx={{ position: 'relative' }}>
                <Box
                    sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 2,
                        border: '3px solid #fff',
                        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer'
                    }}
                    style={{ backgroundColor: color }}
                    onClick={() => toggle(true)}
                />
                <HexColorInput alpha prefixed color={color} onChange={(v:string) => debounced(v)}/>

                {isOpen && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 'calc(100% + 2px)',
                            left: 0,
                            borderRadius: 2,
                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                            zIndex: 999,
                        }}
                    >
                        <RgbaStringColorPicker color={rgbaString} onChange={(v:string) => debounced(v)}/>
                    </Box>
                )}
            </Stack>
        </ClickAwayListener>
    );
};
