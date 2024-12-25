const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, 'src/assets', 'i18n');
['en', 'cn'].forEach(file_prefix => {
    const jsonPath = path.join(i18nDir, file_prefix + '.json');
    fs.writeFileSync(jsonPath, '{}');
    let json = {};
    fs.readdirSync(i18nDir)
        .filter(file => file.startsWith(file_prefix + '_') && file.endsWith('.json'))
        .forEach(file => {
            const filePath = path.join(i18nDir, file);
            const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            json = { ...json, ...fileContent };
        });

    fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
})