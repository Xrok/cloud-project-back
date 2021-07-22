from pcpartpicker import API
import pymongo


# client = pymongo.MongoClient(
#     "mongodb+srv://<username>:<pwd>-@cluster0.4npdx.mongodb.net/unleash?retryWrites=true&w=majority")

client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client.unleash
api = API()


def add_store():
    memoryking = {
        "url": "https://www.memorykings.com.pe/",
        "name": "memorykings",
        "categories": [
            {
                "category": "processor",
                "url": "subcategorias/26/procesadores-intel-amd",
                "garbage_words": [
                    'amd', 'intel', 'procesador', 'cel', 'ci', 'lga', 'ryzen', 'mb', 'ghz', 'core', 'am4', 'v5', 'pentium', 'gold', '115', 'a10', 'threadripper'
                ]
            },
            {
                "category": "monitor",
                "url": "subcategorias/31/monitores-pantallas-tvs"
            }
        ]
    }
    impacto = {
        "url": "https://www.impacto.com.pe/",
        "name": "impacto",
        "categories": [
            {
                "category": "processor",
                "url": "catalogo?categoria=Procesadores%20Complementos",
                "garbage_words": ['proc.', 'intel', 'dual', 'core', 'amd', 'celeron', 'athlon', 'threadripper', 'ryzen',

                                  ]
            },
            {
                "category": "monitor",
                "url": "catalogo?categoria=Monitor%2C%20Tv%20Accesorios"
            }
        ]
    }

    db.stores.insert_many([memoryking, impacto])


def cpu_api():
    cpu_data = api.retrieve("cpu")

    for cpuApi in cpu_data['cpu']:
        cpu = {}
        cpu['brand'] = cpuApi.brand.lower()
        cpu['model'] = cpuApi.model.lower()
        cpu['cores'] = cpuApi.cores
        cpu['base_clock'] = cpuApi.base_clock.cycles
        cpu['boost_clock'] = None if (
            cpuApi.boost_clock is None) else cpuApi.boost_clock.cycles

        cpu['tdp'] = cpuApi.tdp
        cpu['integrated_graphics'] = None if (
            cpuApi.integrated_graphics is None) else cpuApi.integrated_graphics.lower()

        cpu['multithreading'] = cpuApi.multithreading
        # cpu['stores'] = []

        if not db.processors.find_one({'brand': cpu['brand'], 'model': cpu['model']}):

            db.processors.insert_one(cpu)


def find_res(res):
    if res >= 4320:
        return '8K'
    if res >= 2160:
        return 'UHD'
    if res >= 1440:
        return 'QHD'
    if res >= 1080:
        return 'FHD'
    if res >= 720:
        return 'HD'

    return 'No HD'


def monitor_api():
    monitor_data = api.retrieve('monitor')
    height = set()
    ratio = set()
    panel = set()
    rat_map = {}
    res_map = {}
    count = 0
    nonrep = 0

    for monitorApi in monitor_data['monitor']:
        monitor = {}
        monitor['brand'] = monitorApi.brand.lower()
        monitor['model'] = monitorApi.model.lower()
        monitor['size'] = monitorApi.size
        monitor['width'] = monitorApi.resolution.width
        monitor['height'] = monitorApi.resolution.height
        monitor['refresh_rate'] = monitorApi.refresh_rate
        monitor['response_time'] = monitorApi.response_time
        monitor['panel_type'] = monitorApi.panel_type
        monitor['aspect_ratio'] = monitorApi.aspect_ratio
        monitor['resolution'] = find_res(int(monitor['height']))
        count += 1
        # print(monitor)
        if not db.monitors.find_one({'brand': monitor['brand'], 'model': monitor['model']}):

            db.monitors.insert_one(monitor)
        # height.add(monitorApi.resolution.height)
        # ratio.add(monitorApi.aspect_ratio)
        # panel.add(monitorApi.panel_type)

        # rat_map[monitorApi.aspect_ratio] = rat_map[monitorApi.aspect_ratio]+1 if (
        #     monitorApi.aspect_ratio in rat_map.keys()) else 1

        # res_map[str(monitor['height'])+'x'+str(monitor['width'])] = res_map[str(monitor['height'])+'x'+str(monitor['width'])]+1 if (
        #     str(monitor['height'])+'x'+str(monitor['width']) in res_map.keys()) else 1

        # print(monitor)
        # if monitorApi.aspect_ratio in ['256:135', '683:240']:
        #     print(monitor)
    # print(count)
    # print(height)
    # print(ratio)
    # print(panel,)
    # for k, v in rat_map.items():
    #     print(k, v)

    # res_map_l = []

    # for key, value in res_map.items():
    #     temp = [key, value]
    #     res_map_l.append(temp)

    # res_map_l.sort()

    # for _ in res_map_l:-
    #     print(_)


# -----COMENTA O DESCOMENTA LO QUE NCESITES POBLAR EN LA BD
add_store()
cpu_api()
monitor_api()
