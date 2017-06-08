import client from "prom-client";

export let registry = new client.Registry();

export let auth_count = new client.Counter({ name: "sucriber_auth_count", help: "Количество проверок токена"});
export let get_dispatch = new client.Counter({ name: "sucriber_count_get_dispatch", help: "Количество получений каналов рассылки"});
export let update_dispatch = new client.Counter({ name: "sucriber_count_update_dispatch", help: "Количество обновлений каналов рассылки"});
export let update_schedule = new client.Counter({ name: "sucriber_count_update_schedule", help: "Количество обновлений подписок", labelNames: ["type"]});
export let delete_schedule = new client.Counter({ name: "sucriber_count_delete_schedule", help: "Количество удалений подписок", labelNames: ["type"]});
export let get_schedule = new client.Counter({ name: "sucriber_count_get_schedule", help: "Количество получений подписок", labelNames: ["type"]});


registry.registerMetric(auth_count);
registry.registerMetric(get_dispatch);
registry.registerMetric(update_dispatch);
registry.registerMetric(update_schedule);
registry.registerMetric(delete_schedule);
registry.registerMetric(get_schedule);