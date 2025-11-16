export const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const replacer = (key: any, value: any) => value === null ? '' : value;
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    const csvString = csv.join('\r\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) { 
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const importFromCSV = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                const lines = text.split(/[\r\n]+/).filter(line => line);
                if (lines.length < 2) {
                    throw new Error("CSV must have a header and at least one data row.");
                }

                const header = lines[0].split(',').map(h => h.trim());
                const data = lines.slice(1).map(line => {
                    // Simple CSV parsing, may not handle all edge cases like commas in quotes
                    const values = line.split(',');
                    return header.reduce((obj, col, index) => {
                        let value: any = values[index] ? values[index].trim() : '';
                        if (value.startsWith('"') && value.endsWith('"')) {
                            value = value.slice(1, -1);
                        }
                        if (!isNaN(value) && value.trim() !== '') {
                            value = Number(value);
                        }
                        obj[col] = value;
                        return obj;
                    }, {} as {[key: string]: any});
                });
                resolve(data);
            } catch (e) {
                reject(e);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};