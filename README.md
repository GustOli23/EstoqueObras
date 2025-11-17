Sistema de Estoque e Obras – Peretto & Souza

Aplicativo mobile desenvolvido em React Native + Expo para controle de estoque, obras e movimentações de materiais.
Criado como parte de um projeto acadêmico, com base em necessidades reais da empresa Peretto & Souza.

📱 Funcionalidades Principais
🔹 Dashboard

Visão geral do sistema

Total de materiais, obras e áreas

Valor total em estoque

Alertas de estoque mínimo

Movimentações recentes

🔹 Materiais

Cadastro completo de materiais

Unidade de medida configurável (m², m³, sacos, barras etc.)

Estoque atual e estoque mínimo

Valor unitário

Indicação visual de estoque baixo

🔹 Obras

Cadastro de obras

Endereço, cliente, metragem e orçamento

Arquivamento e reativação de obras

Relação com movimentações

🔹 Movimentações

Registro de entrada e saída

Seleção de obra

Quantidade, valor e observações

Histórico completo filtrável

🔹 Configurações

Alternância entre tema claro e tema escuro

Persistência via AsyncStorage

🏗️ Tecnologias Utilizadas

React Native

Expo

React Navigation

Context API

AsyncStorage

Lucide Icons

StyleSheet + Tema Global

FlatList (alta performance)

📦 Estrutura do Projeto
/src
├── components
│ ├── MaterialCard.js
│ ├── StatsCard.js
│ ├── WorkCard.js
│ └── UnitPicker.js
│
├── context
│ ├── DataService.js
│ └── ThemeContext.js
│
├── navigation
│ └── AppNavigator.js
│
├── screens
│ ├── Dashboard.js
│ ├── Materiais.js
│ ├── MaterialForm.js
│ ├── Obras.js
│ ├── WorkForm.js
│ ├── MovimentacaoForm.js
│ └── Historico.js
│
└── styles
├── ToastConfig.js
└── theme.js

App.js  
app.json  
README.md

🚀 Como Executar o Projeto
1️⃣ Clonar o repositório
git clone https://github.com/GustOli23/EstoqueObras
cd EstoqueObras

2️⃣ Instalar as dependências
npm install

3️⃣ Executar o aplicativo
npm start

Isso abrirá o Expo DevTools no navegador.

4️⃣ Rodar o app:

📱 Expo Go (Android / iOS)
→ Escanear o QR Code exibido

📱 Emulador Android
Pressione a no terminal

💻 Navegador Web
Pressione w

📄 Documento de Design

O documento completo de design do aplicativo está disponível em:

/docs/Documento_Design_App.docx

Ou pode ser solicitado diretamente ao desenvolvedor.

🧪 Testes Realizados

Cadastro e edição de materiais

Persistência local via AsyncStorage

Navegação entre telas

Mudança de tema

Arquivamento de obras

Registro e exibição de movimentações

Testes com dados reais da construtora

🎯 Objetivo Acadêmico

Este projeto foi desenvolvido como parte de um estudo prático de:

Arquitetura mobile

Persistência local

Interface e experiência do usuário

Modularização e padrões de projeto

Versionamento e documentação técnica

👨‍💻 Autor

Gustavo Aparecido de Oliveira
GitHub: https://github.com/GustOli23

📬 Contato

Para dúvidas, sugestões ou avaliação do projeto, entrar em contato pelo e-mail:
📧 ap.gustavo21@gmail.com
