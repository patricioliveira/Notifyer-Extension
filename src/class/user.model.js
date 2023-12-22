/**
 * Classe para realizar login.
 */
export class LoginUser {

    /**
     * @type {string} - O nome de usuário.
     */
    username;

    /**
     * @type {string} - A senha (inicializada como uma string vazia por padrão).
     */
    password;

    /**
     * Verifica os dados do usuário.
     * @param {LoginData} loginData - Os dados de login do usuário.
     * @throws {UserException} Lança uma exceção se os dados do usuário forem inválidos.
     */
    verifyUserData(loginData) {
        // Lógica de verificação dos dados do usuário aqui.
        // Lança uma exceção se os dados não são válidos.
        if(loginData.username == '' || loginData.password == ''){
            throw new UserException("Inserir dados para fazer o login");
        }
    }
}