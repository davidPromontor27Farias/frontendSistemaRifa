import * as XLSX from 'xlsx';

export function exportarExcel(filas: Record<string, unknown>[], nombreArchivo: string, nombreHoja = 'Datos') {
    const hoja = XLSX.utils.json_to_sheet(filas);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, nombreHoja);
    XLSX.writeFile(libro, nombreArchivo);
}
