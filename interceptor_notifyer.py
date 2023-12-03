from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    try:
        data = request.get_json()

        # Extraindo informações relevantes do JSON da requisição
        status_pedido = data.get('status')
        numero_pedido = data.get('id')
        telefone_cliente = data.get('client_phone')
        nome_cliente = data.get('client_name')

        # Lógica para decidir quando enviar mensagem pelo WhatsApp
        if status_pedido == 3:  # Coloque o status desejado aqui
            verificado = verifify_session()
            if verificado == True:
                enviar_mensagem_whatsapp(numero_pedido, telefone_cliente, nome_cliente)

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

# Função para enviar mensagem pelo WhatsApp
def enviar_mensagem_whatsapp(numero_pedido, telefone_cliente, nome_cliente):
    try:
        # Substitua a URL abaixo pela URL da sua API do WhatsApp HTTP
        whatsapp_api_url_sendMessage = "http://localhost:3000/send_message"
        whatsapp_api_url_verifySession = "http://localhost:3000/api/sessions/{default}/me"
        whatsapp_api_url_Sessions = "http://localhost:3000/api/sessions?all=false"

        name_session = ""
        mensagem = f"O pedido {numero_pedido} para {nome_cliente} foi atualizado! Status: Pronto para entrega."
        message = "http://localhost:3000/api/sendText?phone=55{telefone_cliente}&text={mensagem}&session={session_cliente}"

        # Dados para a requisição para a API do WhatsApp HTTP

        
        # Faça a requisição para a API do WhatsApp HTTP - Verificação de existencia da sessão
        response = requests.post(whatsapp_api_url_verifySession)
        
        # Faça a requisição para a API do WhatsApp HTTP - Enviar Notificação de Status do Pedido
        response = requests.post(whatsapp_api_url_sendMessage, json=dataMessage)

        if response.status_code == 200:
            print(f"Mensagem para {nome_cliente} enviada com sucesso!")
        else:
            print(f"Falha ao enviar mensagem para {nome_cliente}. Código de status: {response.status_code}")

    except Exception as e:
        print(f"Erro ao enviar mensagem pelo WhatsApp: {str(e)}")


def verify_session():
    try:

        whatsapp_api_url_Sessions = "http://localhost:3000/api/sessions?all=false"
        whatsapp_api_url_verifySession = "http://localhost:3000/api/sessions/{sessionName}/me"

        
        # Faça a requisição para a API do WhatsApp HTTP - Verificação do nome da sessão
        name_session = requests.get(whatsapp_api_url_verifySession)

        if name_session.status_code == 200:
            print(f"Sessão encontrada com sucesso!")
            sessionName = name_session.data

            # Faça a requisição para a API do WhatsApp HTTP - Verificação de existencia da sessão
            response = requests.get(whatsapp_api_url_verifySession)

            if response.status_code == 200:
                print(f"Verificação da sessão foi completa. A sessão {sessionName} está funcionando corretamente!")
                return True, sessionName
            else:
                print(f"Falha ao verificar funcionamento da sessão. Código de status: {response.status_code}")
                return False
            
        else:
            print(f"Falha ao encontrar sessão. Código de status: {name_session.status_code}")

    except Exception as e:
        print(f"Erro ao verificar sessão: {str(e)}")

def getNamedSession():
    





if __name__ == '__main__':
    app.run(port=6000)
