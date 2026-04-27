# 🌾 Bazo Farm v4 — Cotações ao vivo

## ✨ NOVIDADE: Cotações na tela inicial!

### 💱 Moedas em tempo real
- **Dólar (USD/BRL)** — atualização em tempo real via AwesomeAPI
- **Euro (EUR/BRL)** — atualização em tempo real
- Mostra variação % do dia (↑/↓)

### 🌾 Commodities (referência)
- **Soja** (sc 60kg) — CEPEA/Paranaguá
- **Milho** (sc 60kg) — CEPEA/Campinas
- **Trigo** (sc 60kg) — CEPEA/PR
- **Arroz** (sc 50kg) — CEPEA/RS
- **Boi gordo** (@/15kg) — CEPEA/SP
- **Leite** (litro) — CEPEA Mensal
- **Suíno vivo** (kg) — CEPEA/SC

### ⚠️ Importante sobre commodities

O CEPEA/ESALQ não tem API pública gratuita. Os valores mostrados são **referenciais** baseados em última cotação conhecida. Pra preços **oficiais e em tempo real**, sempre confira em:

**cepea.esalq.usp.br**

Tem aviso bem claro disso no app. O dólar e euro SIM são em tempo real (refresh automático a cada 30 min).

### 🍇 Cotações regionais (manual)
- Aba nova **"Cotações regionais"** em **Mais**
- Cadastre preços de **uva** (Cabernet, Isabel, Niágara), **maçã** (Gala, Fuji), preços de cooperativas locais, leite por laticínio, etc.
- Aparecem na tela inicial em card próprio
- Mantém histórico por data
- Sugestões de produtos pré-cadastradas

### 🔄 Botão de atualizar
- Botão de refresh no card de cotações
- Cache de 30 min (não bate na API toda hora)

---

## 📋 Casos de uso

**Você (agrônomo) abre o app de manhã:**
- Vê dólar do dia
- Vê referência CEPEA de soja/milho
- Vê preço da uva Cabernet que você mesmo registrou na cooperativa local
- Tudo em uma tela só

**Cliente seu (produtor de uva):**
- Você compartilha o link
- Ele vê dólar (importante pra insumos importados)
- Ele vê cotação da uva que você cadastrou
- Toma decisão de quando comercializar

---

## 📱 Como atualizar (mesmo passo a passo)

1. **github.com/nikbazzo-spec/bazo-farm**
2. Settings → Delete this repository
3. Cria novo: **+** → New repository → bazo-farm → Public
4. **uploading an existing file**
5. Entra na pasta `bazo-v4`, Ctrl+A, arrasta tudo
6. Commit
7. Vercel atualiza sozinho (ou import de novo)

---

## 🎯 Nova oportunidade comercial

Cotações são uma das funcionalidades mais "viciantes" pra produtor rural — todo dia ele abre o app pra ver. Isso aumenta:
- Engajamento (uso diário)
- Boca-a-boca (mostra pros vizinhos)
- Disposição de pagar

**Argumento de venda novo:**
> "Tem dólar, soja, milho, boi gordo e ainda dá pra cadastrar preço da sua cooperativa. Tudo num só lugar."

---

🚀 **Bazo Farm v4** — agora com cotações ao vivo
