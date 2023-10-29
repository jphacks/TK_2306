def transition_time_table(days:int, workers:int ,table1: list[list[list[tuple[int, int]]]]
                          ) ->list[list[set[int]]]: 
    res = [[set() for _ in range(48)] for _ in range(days)]
    for worker in range(workers):
        for day in range(days):
            for from_, to_ in table1[worker][day]:
                for time_ in range(from_, to_):
                    res[day][time_].add(worker)
    return res

def trans(days, workers, candidate:list[list[list[list[tuple[int, int]]]]]):
    res = []
    for sol in candidate:
        res.append(transition_time_table(days,workers,sol))