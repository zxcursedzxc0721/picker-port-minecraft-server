const fs = require('fs/promises'); // Используем версию fs с промисами для асинхронных операций
const { ping } = require('bedrock-protocol'); // Только bedrock-protocol необходим здесь
const readline = require('readline');

// Создаем интерфейс для ввода/вывода
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}
// Функция для сохранения серверов в JSON файл
async function saveChatServers(serversFile, data) {
    try {
        await fs.writeFile(serversFile, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Ошибка при сохранении серверов: ${err}`);
    }
}

// Функция для проверки статуса сервера
async function getServer(host) {
    const chatServers = {}; // Объект для хранения доступных портов
    for (let port = 1; port <= 65535; port++) {
        try {
            const res = await ping({ host, port }); // Ожидаем результат пинга
            if (res) {
                console.log(`Успешно подключено к хосту ${host} на порту ${port}.`);
                chatServers[host] = { port }; // Сохраняем только доступный порт
                await saveChatServers('server.json', chatServers); // Сохраняем в файл
                break; // Выходим из цикла, если нашли доступный порт
            } else {
                console.log(`Сервер ${host}:${port} недоступен.`);
            }
        } catch (error) {
            console.error(`Ошибка подключения к ${host}:${port}: ${error.message}`);
        }
    }
    console.log(`Нет доступных портов для ${host}`);
}

// Основная функция
async function main() {
    const host = await getInput('Введите IP-адрес сервера для подбора порта:')
    await getServer(host);
}
 main();