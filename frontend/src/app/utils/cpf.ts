
import { Pipe, PipeTransform } from '@angular/core';

// No banco o CPF é salvo formatado: 000.000.000-00 (coluna de 14 caracteres)

/** Retorna apenas os dígitos do CPF. */
export function apenasDigitosCpf(cpf: string | null | undefined): string {
  return (cpf || '').replace(/\D/g, '');
}

/**
 * Formata o CPF como 000.000.000-00.
 * Aceita CPF com ou sem pontuação; se não tiver 11 dígitos, devolve o valor original.
 */
export function formatarCpf(cpf: string | null | undefined): string {
  const n = apenasDigitosCpf(cpf);

  if (n.length !== 11) {
    return cpf || '';
  }

  return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9, 11)}`;
}

/** Uso no template: {{ usuario.cpf | cpf }} */
@Pipe({
  name: 'cpf'
})
export class CpfPipe implements PipeTransform {
  transform(cpf: string | null | undefined): string {
    return formatarCpf(cpf);
  }
}
