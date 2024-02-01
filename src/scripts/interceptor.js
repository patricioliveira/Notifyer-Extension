class Order {
    constructor(data) {
        this.id = data.id || null;
        this.client_id = data.client_id || null;
        this.origin = data.origin || null;
        this.store_id = data.store_id || null;
        this.payment = data.payment || null;
        this.change = data.change || 0;
        this.address = data.address || null;
        this.observation = data.observation || null;
        this.variable_fee_id = data.variable_fee_id || null;
        this.fee_name = data.fee_name || '';
        this.reference = data.reference || null;
        this.delivery_method = data.delivery_method || null;
        this.source = data.source || null;
        this.status = data.status || null;
        this.created_at = data.created_at || null;
        this.updated_at = data.updated_at || null;
        this.discount_id = data.discount_id || null;
        this.discount_value = data.discount_value || 0;
        this.total = data.total || 0;
        this.fee_total = data.fee_total || 0;
        this.points_total = data.points_total || 0;
        this.number = data.number || null;
        this.driver_id = data.driver_id || null;
        this.driver_name = data.driver_name || null;
        this.pickup_time = data.pickup_time || null;
        this.zipcode = data.zipcode || null;
        this.table_number = data.table_number || null;
        this.table_open = data.table_open || 0;
        this.tax_value = data.tax_value || 0;
        this.client_first_order = data.client_first_order || 0;
        this.client_total_orders = data.client_total_orders || 0;
        this.mercadopago_id = data.mercadopago_id || null;
        this.mercadopago_status = data.mercadopago_status || null;
        this.mercadopago_payer_id = data.mercadopago_payer_id || null;
        this.mercadopago_date_created = data.mercadopago_date_created || null;
        this.offline = data.offline || 0;
        this.client_name = data.client_name || null;
        this.client_phone = data.client_phone || null;
        this.client_email = data.client_email || null;
        this.payment_name = data.payment_name || null;
        this.operator_name = data.operator_name || null;
        this.fiscal_id = data.fiscal_id || null;
        this.delivery_time = data.delivery_time || null;
        this.service_fee_total = data.service_fee_total || 0;
        this.ifood_order_id = data.ifood_order_id || null;
        this.ifood_shipping_order_id = data.ifood_shipping_order_id || null;
        this.cancellation_code = data.cancellation_code || null;
        this.cancellation_reason = data.cancellation_reason || null;
        this.client_cancellation_request = data.client_cancellation_request || null;
        this.additions_value = data.additions_value || 0;
        this.ifood_display_id = data.ifood_display_id || null;
        this.origin_front = data.origin_front || null;
        this.discount_name = data.discount_name || '';
        this.estimate = data.estimate || '';
        this.cashback_total = data.cashback_total || 0;
        this.paid = data.paid || 0;
        this.motoboy_time = data.motoboy_time || null;
        this.city_name = data.city_name || null;
        this.accept_time = data.accept_time || null;
        this.ready_time = data.ready_time || null;
        this.short_id_value = data.short_id_value || null;
        this.is_logged = data.is_logged || 0;
        this.pix_id = data.pix_id || null;
        this.pix_status = data.pix_status || 1;
        this.pix_code = data.pix_code || null;
        this.pix_image_url = data.pix_image_url || null;
        this.instagram_points = data.instagram_points || 0;
        this.free_delivery_fee = data.free_delivery_fee || 0;
        this.client_tax_id = data.client_tax_id || null;
        this.ifood_discount = data.ifood_discount || 0;
        this.messages = data.messages || {};
        this.created_date = data.created_date || null;
        this.created_only_time = data.created_only_time || null;
        this.created_only_date = data.created_only_date || null;
        this.payment_id = data.payment_id || null;
        this.mercadopago_status_text = data.mercadopago_status_text || null;
        this.client = data.client || {};
        this.order_type_text = data.order_type_text || null;
        this.delivery_time_minutes = data.delivery_time_minutes || '';
        this.driver_delivery_time_minutes = data.driver_delivery_time_minutes || '';
        this.multiple_payments = data.multiple_payments || [];
        this.cancellation_code_text = data.cancellation_code_text || null;
        this.prepare_time_minutes = data.prepare_time_minutes || '';
        this.store = data.store || {};
        this.cart_itens = data.cart_itens || [];
        this.driver = data.driver || null;
    }
    
    convertToWhatsAppFormat(originalMessage) {
        const textoDecodificado = decodeURIComponent(originalMessage.replace(/\+/g, ' '));
        const textoFormatado = textoDecodificado
            .replace(/[\n\r]+/g, '\n') // Remove quebras de linha duplicadas
            .replace(/\*\*/g, '*') // Remove asteriscos extras
            .replace(/\*Para repetir[^*]+\*/g, ''); // Remove partes específicas

        return textoFormatado.trim();
    }
}

class Notification extends Order {

    constructor(data) {
        super(data);
        this.cookie = this.getCookie();
        this.sessionToken = this.cookie;
        this.method = 'send-message';
        // this.urlApi = `http://localhost:21465/api/${this.cookie}/${this.method}`;
        this.urlApi = `http://179.190.205.59:21465/api/${this.cookie}/${this.method}`;
    }


    sendToAPI() {
        // Constrói o objeto de dados para enviar à API de mensagens
        var messageData = {
            //TODO: VERIFICAR A QUANTIDADE DE DIGITOS DO NÚMERO PRA SABER SE ESTA FALTANDO O DDI
            phone: "55" + this.client_phone,
            isGroup: false,
            message: this.convertToWhatsAppFormat(this.messages.wpp_message),
        };

        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Accept-Language", "pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7");
        myHeaders.append("Connection", "keep-alive");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Sec-Fetch-Dest", "empty");
        myHeaders.append("Sec-Fetch-Mode", "cors");
        myHeaders.append("Sec-Fetch-Site", "same-site");
        myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36");
        myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"");
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("sec-ch-ua-platform", "\"Windows\"");

        // Configuração para a requisição POST
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(messageData),
            redirect: 'follow'
        };

        // Realiza a requisição para a API de mensagens
        fetch(this.urlApi, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao enviar mensagem para a API. Status HTTP: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Resposta da API:', data); // Registra a resposta da API
            })
            .catch(error => {
                console.error('Erro ao enviar mensagem para a API:', error);
            });
    };

    getCookie() {
        // Use um método síncrono para obter o cookie
        const cookieName = 'access_token='
        let cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${cookieName}`));
        cookie = cookie.split('=')[1];
        try {
            const [, tokenPayload] = cookie.split('.');
            const decodedPayload = atob(tokenPayload);
            return JSON.parse(decodedPayload).token
        } catch (error) {
            console.error('Erro ao obter informações da loja a partir do token:', error);
            return '';
        }
    }
}

(function() {

    // Padrão de URL desejado
    var urlPattern = 'https://app.instadelivery.com.br/api/stores/orders/';

    // Intercepta a função open do XMLHttpRequest para capturar informações
    var originalOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function() {
        let metodo = arguments[0].toString();
        let urlRequest = arguments[1].toString();

        // Verifica se a URL começa com o padrão desejado
        if ((metodo == "PUT" || metodo == "POST") && urlRequest.startsWith(urlPattern)) {
            // Adicione um ouvinte para capturar o corpo da resposta
            this.addEventListener('load', function () {
                try {
                    if (this.responseText.trim() !== '') {
                        // Tenta converter a string JSON em um objeto JavaScript
                        var responseObject = JSON.parse(this.responseText);

                        // Cria uma instância da classe Notification
                        var orderObject = new Notification(responseObject);

                        // Envia os dados para a API de mensagens
                        if (!((orderObject.order_type_text === 'Retirada Balcão' || orderObject.order_type_text === 'Delivery') && urlRequest.startsWith(urlPattern +"deliveryTime")))
                            orderObject.sendToAPI();
                        
                    } else {
                        console.error('A resposta está vazia.');
                    }
                } catch (error) {
                    console.error('Erro:', error);
                }
            });
        }

        // Chama a função open original
        originalOpen.apply(this, arguments);
    };
})();

//status = 1: Pedido Recebido
//status = 2: Pedido Aceito
//status = 3: Pedido Pronto
//status = 4: Pedido Cancelado