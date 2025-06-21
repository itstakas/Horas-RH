function calcularDiferenca(inicio, fim) {
    if (!inicio || !fim || inicio === '00:00' || fim === '00:00') return 0;
    const i = horaParaDecimal(inicio);
    const f = horaParaDecimal(fim);
    return f >= i ? f - i : (24 - i + f);
}

function calcularNoturno(ini, fim, perfilAtivo) {
    if (!ini || !fim) return 0;
    const i = horaParaDecimal(ini);
    const f = horaParaDecimal(fim);
    const ni = horaParaDecimal(perfilAtivo.inicioNoturno);
    const nf = horaParaDecimal(perfilAtivo.fimNoturno);
    let total = 0;
    for (let h = i; h < (f < i ? f + 24 : f); h += 1/60) {
        let horaAtual = h % 24;
        if (ni < nf) {
            if (horaAtual >= ni && horaAtual < nf) total += 1/60;
        } else {
            if (horaAtual >= ni || horaAtual < nf) total += 1/60;
        }
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
