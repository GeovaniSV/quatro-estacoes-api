import env from '#start/env'
import { transporter } from '#config/nodemailer'
import Item from '#models/item'

class SendEmail {
  sendClientEmail(userEmail: string, userName: string, items: Item[], amounTotal: string) {
    const rows = items
      .map((item: Partial<Item>) => {
        return `
        <tr>
          <td>${item.product?.productName}</td>
          <td>${item.productColor}</td>
          <td>${item.productQuantity}</td>
          <td class="right">R$ ${item.product?.priceView}</td>
          <td class="right">R$ ${item.priceView}</td>
        </tr>
      `
      })
      .join('')

    transporter
      .sendMail({
        from: `4 Estações Vasos & Acessórios <${env.get('nodemailer_email')}> `,
        to: userEmail,
        subject: 'Enviando email teste',
        html: `  <!doctype html>
  <html lang="pt-BR">
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <title>Confirmação de pedido</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; color:#111; margin:0; padding:20px; background:#f5f6f8; }
        .card { background:#fff; max-width:600px; margin:0 auto; padding:18px; border-radius:6px; box-shadow:0 1px 3px rgba(0,0,0,0.08); }
        h2 { margin:0 0 8px 0; font-size:18px; }
        p { margin:6px 0; font-size:14px; }
        table { width:100%; border-collapse:collapse; margin-top:12px; }
        td, th { padding:8px; border-bottom:1px solid #eee; text-align:left; font-size:14px; }
        .right { text-align:right; }
        .total { font-weight:700; font-size:15px; }
        .footer { margin-top:14px; font-size:12px; color:#666; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Confirmação de pedido</h2>
        <p>Olá <strong>${userName}</strong>, obrigado pela sua compra!</p>

        <table role="presentation">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Cor</th>
              <th>Qtd</th>
              <th class="right">Preço unit.</th>
              <th class="right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2"></td>
              <td class="right total">Total</td>
              <td class="right total">R$ ${amounTotal}</td>
            </tr>
          </tfoot>
        </table>
        <p>Assim que seus produtos ficarem prontos você receberá um aviso via email</p>

        <p class="footer">Se precisar de ajuda, entre em contato com a empresa através do site!</p>
      </div>
    </body>
  </html>
  `,
      })
      .then((response) => console.log('Email enviado com sucesso', response))
      .catch((err) => {
        console.error('Algo deu errado: ', err)
        return err
      })
  }

  sendFactoryEmail(items: Item[]) {
    const rows = items
      .map((item: Partial<Item>) => {
        return `
        <tr>
          <td>${item.product?.productName}</td>
          <td>${item.productColor}</td>
          <td>${item.productQuantity}</td>
        </tr>
      `
      })
      .join('')

    transporter
      .sendMail({
        from: `4 Estações Vasos & Acessórios <${env.get('nodemailer_email')}> `,
        to: 'maniyt60@gmail.com',
        subject: 'Pedido para fabrica',
        html: `  <!doctype html>
  <html lang="pt-BR">
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <title>Confirmação de pedido</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; color:#111; margin:0; padding:20px; background:#f5f6f8; }
        .card { background:#fff; max-width:600px; margin:0 auto; padding:18px; border-radius:6px; box-shadow:0 1px 3px rgba(0,0,0,0.08); }
        h2 { margin:0 0 8px 0; font-size:18px; }
        p { margin:6px 0; font-size:14px; }
        table { width:100%; border-collapse:collapse; margin-top:12px; }
        td, th { padding:8px; border-bottom:1px solid #eee; text-align:left; font-size:14px; }
        .right { text-align:right; }
        .total { font-weight:700; font-size:15px; }
        .footer { margin-top:14px; font-size:12px; color:#666; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Pedido</h2>

        <table role="presentation">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Cor</th>
              <th>Qtd</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <p class="footer">Se precisar de ajuda, entre em contato com a empresa através do site!</p>
      </div>
    </body>
  </html>
  `,
      })
      .then((response) => console.log('Email enviado com sucesso', response))
      .catch((err) => {
        console.error('Algo deu errado: ', err)
        return err
      })
  }
}

export { SendEmail }
