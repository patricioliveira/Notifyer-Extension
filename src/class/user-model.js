/**
 * Classe para realizar login.
 */
export class LoginUser {

    /**
     * @type {string} - O nome de usuário.
     */
    Email;

    /**
     * @type {string} - A senha (inicializada como uma string vazia por padrão).
     */
    Password;

    /**
     * Verifica os dados do usuário.
     * @param {LoginData} loginData - Os dados de login do usuário.
     * @throws {Exception} Lança uma exceção se os dados do usuário forem inválidos.
     */
    verifyUserData(loginData) {
        // Lógica de verificação dos dados do usuário aqui.
        // Lança uma exceção se os dados não são válidos.
        if(loginData.email == '' || loginData.password == ''){
            throw new Exception("Inserir dados para fazer o login");
        }
    }
}
