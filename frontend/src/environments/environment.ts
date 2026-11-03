// NG_API_URL e injetada no build a partir da variavel de ambiente API_URL
// (ver .github/workflows/deploy-frontend-azure.yml):
//   npm run build -- --define "NG_API_URL='https://minha-api.azurewebsites.net'"
// Sem o define (ex.: ng serve local) usa o backend local.
declare const NG_API_URL: string | undefined;

export const environment = {
  apiUrl: typeof NG_API_URL !== 'undefined' && NG_API_URL ? NG_API_URL : 'http://localhost:8080',
};
