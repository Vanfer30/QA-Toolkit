FROM cypress/included:12.17.4

WORKDIR /app

COPY . .

RUN npm ci

RUN rm -f /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update \
  && apt-get install -y git jq bash curl gnupg \
  && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | \
     gpg --dearmor -o /usr/share/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | \
     tee /etc/apt/sources.list.d/github-cli.list \
  && apt-get update \
  && apt-get install -y gh

RUN chmod +x scripts/*.sh || true

CMD ["npm", "run", "test:all"]

