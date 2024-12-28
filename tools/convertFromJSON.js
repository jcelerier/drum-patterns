/**
 * Converts drum patterns from JSON format used in stephenhandley/DrumMachinePatterns 
 * repository to .pat format.
 * 
 * JSON format example:
 * {
 *   "title": "Pattern1",
 *   "tracks": {
 *     "bassdrum": ["Note", "Rest", "Note", "Rest"],
 *     "snaredrum": ["Rest", "Note", "Rest", "Note"]
 *   },
 *   "accent": ["Accent", "Rest", "Rest", "Rest"]
 * }
 * 
 * Output .pat format example:
 * BD x-x-
 * SD -x-x
 * AC x---
 * 
 * Usage:
 * node convertFromJSON.js         # Use drum names (BD, SD, etc)
 * node convertFromJSON.js --gm    # Use GM MIDI note numbers
 */

const fs = require('fs');
const path = require('path');

// Mapping of instrument names to drum names and GM note numbers
const drumMap = {
    'bassdrum': { name: 'BD', gmNote: '36' },
    'snaredrum': { name: 'SD', gmNote: '38' },
    'lowtom': { name: 'LT', gmNote: '43' },
    'mediumtom': { name: 'MT', gmNote: '47' },
    'hightom': { name: 'HT', gmNote: '50' },
    'closedhihat': { name: 'CH', gmNote: '42' },
    'openhihat': { name: 'OH', gmNote: '46' },    
    'cymbal': { name: 'CY', gmNote: '49' },
    'rimshot': { name: 'RS', gmNote: '37' },
    'clap': { name: 'CP', gmNote: '39' },
    'cowbell': { name: 'CB', gmNote: '56' },
    'tambourine': { name: 'TM', gmNote: '54' },
};

// Use GM note numbers if specified as command line argument
const useGMNotes = process.argv.includes('--gm');

// Read the Patterns.json file
const inputFile = './Patterns.json';
const outputDir = './output';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read and parse the JSON file
const patterns = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

// Process each pattern
patterns.forEach(pattern => {
    const { title, tracks, accent } = pattern;
    const patternLines = [];

    // Get the maximum track length
    const trackLengths = Object.values(tracks).map(track => track.length);
    const maxLength = Math.min(...trackLengths);

    // Process each track
    Object.entries(tracks).forEach(([instrument, notes]) => {
        const drumInfo = drumMap[instrument.toLowerCase()] || { name: instrument, gmNote: '0' };
        const trackId = useGMNotes ? drumInfo.gmNote : drumInfo.name;
        // Convert notes to 'x' and '-' format
        const patternLine = notes.slice(0, maxLength).map(note => {
            if (note === 'Note') return 'x';
            if (note === 'Flam') return 'f';
            return '-';
        }).join('');
        patternLines.push(`${trackId} ${patternLine}`);
    });

    // Process accent line if exists
    if (accent) {
        const accentLine = accent.slice(0, maxLength).map(note => {
            if (note === 'Accent') return 'x';
            else return '-';
        }).join('');
        patternLines.push(`AC ${accentLine}`);
    }

    // Write the pattern to a .pat file
    const outputFile = path.join(outputDir, `${title}.pat`);
    fs.writeFileSync(outputFile, patternLines.join('\n'), 'utf8');
    console.log(`Created ${outputFile}`);
});

console.log('Conversion complete!');
