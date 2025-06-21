function calcularDiferenca(inicio, fim) {
    if (!inicio || !fim || inicio === '00:00' || fim === '00:00') return 0;
    const i = horaParaDecimal(inicio);
    const f = horaParaDecimal(fim);
    return f >= i ? f - i : (24 - i + f);
}

function calcularNoturno(ini, fim) {
    if (!ini || !fim) return 0;
    const i = horaParaDecimal(ini);
    const f = horaParaDecimal(fim);
    const ni = horaParaDecimal(premissas.inicioNoturno);
    const nf = horaParaDecimal(premissas.fimNoturno);
    let total = 0;
    for (let h = i; h != f; h = (h + 0.01) % 24) {
        const hCorr = Math.floor(h) + ((h % 1) * 60 / 100);
        if (ni < nf) {
            if (hCorr >= ni && hCorr < nf) total += 1 / 60;
        } else {
            if (hCorr >= ni || hCorr < nf) total += 1 / 60;
        }
        if (Math.abs(h - f) < 0.02) break;
    }
    return total;
}

function horaParaDecimal(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return h + m / 60;
}

function formatarHoras(decimal) {
    const sinal = decimal < 0 ? '-' : '';
    const abs = Math.abs(decimal);
    const h = Math.floor(abs);
    const m = Math.round((abs - h) * 60);
    return `${sinal}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
