import { Position } from 'reactflow';

// TODO: Make editor to make more of these (Resistors, Capacitors, etc.)

export const LED_DESGIN = {
    width: 15,
    height: 30,
    lineWidth: 1,
    lineColor: 'white',
    path: [
        {
            cmd: 'beginPath',
        },
        {
            cmd: 'moveTo',
            x: 5,
            y: 30,
        },
        {
            cmd: 'lineTo',
            x: 5,
            y: 10,
        },
        {
            cmd: 'lineTo',
            x: 6,
            y: 10,
        },
        {
            cmd: 'lineTo',
            x: 6,
            y: 12,
        },
        {
            cmd: 'lineTo',
            x: 6,
            y: 8,
        },
        {
            cmd: 'lineTo',
            x: 9,
            y: 10,
        },
        {
            cmd: 'lineTo',
            x: 6,
            y: 12,
        },
        {
            cmd: 'moveTo',
            x: 9,
            y: 12,
        },
        {
            cmd: 'lineTo',
            x: 9,
            y:8,
        },
        {
            cmd: 'moveTo',
            x: 9,
            y: 10,
        },
        {
            cmd: 'lineTo',
            x: 10,
            y: 10,
        },

        {
            cmd: 'lineTo',
            x: 10,
            y: 25,
        },
        // Bulb
        {
            cmd: 'moveTo',
            x: 12,
            y: 14,
        },
        {
            cmd: 'lineTo',
            x: 3,
            y: 14,
        },
        {
            cmd: 'lineTo',
            x: 3,
            y: 12,
        },
        {
            cmd: 'lineTo',
            x: 4,
            y: 12,
        },
        {
            cmd: 'lineTo',
            x: 4,
            y: 7,
        },
        {
            cmd: 'moveTo',
            x: 12,
            y: 14,
        },
        {
            cmd: 'lineTo',
            x: 12,
            y: 12,
        },
        {
            cmd: 'lineTo',
            x: 11,
            y: 12,
        },
        {
            cmd: 'lineTo',
            x: 11,
            y: 7,
        },
        {
            cmd: 'moveTo',
            x: 4,
            y: 7,
        },
        {
            cmd: 'arc',
            x: 7.5,
            y: 7,
            r: 3.5,
            startAngle: Math.PI,
            endAngle: Math.PI*2,
        },
        {
            cmd: 'stroke',
        },
        {
            cmd: 'closePath',
        }
    ],
    handles: [
        {
            id: 'a',
            type: 'source',
            position: Position.Bottom,
            style: {
                left: 5
            }
        },
        {
            id: 'b',
            type: 'source',
            position: Position.Bottom,
            style: {
                bottom: 5,
                left: 10
            }
        }
    ]
}

export const BATTERY_DESGIN = {
    width: 16,
    height: 32,
    lineWidth: 1,
    lineColor: 'white',
    path: [
        {
            cmd: 'beginPath',
        },
        {
            cmd: 'moveTo',
            x: 8,
            y: 32,
        },
        {
            cmd: 'lineTo',
            x: 8,
            y: 21,
        },
        {
            cmd: 'moveTo',
            x: 6,
            y: 21,
        },
        {
            cmd: 'lineTo',
            x: 10,
            y: 21,
        },

        {
            cmd: 'moveTo',
            x: 3,
            y: 18,
        },
        {
            cmd: 'lineTo',
            x: 13,
            y: 18,
        },

        {
            cmd: 'moveTo',
            x: 6,
            y: 15,
        },
        {
            cmd: 'lineTo',
            x: 10,
            y: 15,
        },

        {
            cmd: 'moveTo',
            x: 3,
            y: 12,
        },
        {
            cmd: 'lineTo',
            x: 13,
            y: 12,
        },
        {
            cmd: 'moveTo',
            x: 8,
            y: 12,
        },
        {
            cmd: 'lineTo',
            x: 8,
            y: 0,
        },
        
        {
            cmd: 'stroke',
        },
        {
            cmd: 'closePath',
        }
    ],
    handles: [
        {
            id: 'a',
            type: 'source',
            position: Position.Top,
            style: {}
        },
        {
            id: 'b',
            type: 'source',
            position: Position.Bottom,
            style: {}
        }
    ]
}