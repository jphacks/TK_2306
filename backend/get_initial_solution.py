import random
import time

class State:
    def __init__(self,days:int,number_of_attributes:int,
                 shift_preference_per_person: list[list[list[tuple[int,int]]]],
                 attributes_per_person: list[list[int]]):
        self.days = days
        self.attributes = number_of_attributes
        self.peoples : int = len(shift_preference_per_person)
        self.number_of_people_per_time : list[list[int]] = [[0 for _ in range(48)] for _ in range(days)]
        self.number_of_people_per_time_per_attribute : list[list[list[int]]] = [
            [[0 for _ in range(number_of_attributes)] for _ in range(48)] for _ in range(days)]

        for person_id in range(self.peoples):
            for day in range(days):
                for from_, to_ in shift_preference_per_person[person_id][day]:
                    for time_ in range(from_,to_):
                        self.number_of_people_per_time[day][time_] += 1
                        for attribute in attributes_per_person[person_id]:
                            self.number_of_people_per_time_per_attribute[day][time_][attribute] += 1
        
    def is_ok(self,
              shift_requirements_per_time: list[list[tuple[int, int]]],
              attribute_requirement_per_time : list[list[list[tuple[int,int]]]],
              ) -> bool:
        for day in range(self.days):
            for time_, (min_, max_) in enumerate(shift_requirements_per_time[day]):
                if (
                    self.number_of_people_per_time[day][time_] < min_
                    or self.number_of_people_per_time[day][time_] > max_
                ):
                    return False
        
        for day in range(self.days):
            for time_, attribute_requirement in enumerate(attribute_requirement_per_time[day]):
                for attribute_id, (min_, max_) in enumerate(attribute_requirement):
                    if (
                        self.number_of_people_per_time_per_attribute[day][time_][attribute_id] < min_
                        or self.number_of_people_per_time_per_attribute[day][time_][attribute_id] > max_
                    ):
                        return False
        return True
        
    def delete(
        self,
        person_id: int,
        day: int,
        from_ : int,
        to_ : int,
        attributes_per_person: list[list[int]],
        shift_requirements_per_time: list[list[tuple[int, int]]],
        attribute_requirement_per_time: list[list[list[tuple[int, int]]]],
    ) -> bool:
        assert from_ + 1 == to_
        if(
            self.number_of_people_per_time[day][from_]
            <= shift_requirements_per_time[day][from_][0]
        ):
            return False
        
        for attribute in attributes_per_person[person_id]:
            if(
                self.number_of_people_per_time_per_attribute[day][from_][attribute]
                <= attribute_requirement_per_time[day][from_][attribute][0]
            ):
                return False
            
        self.number_of_people_per_time[day][from_] -= 1
        for attribute in attributes_per_person[person_id]:
            self.number_of_people_per_time_per_attribute[day][from_][attribute] -= 1
        return True

    # rnd_num を二つに分けました。 rnd_day -> ランダムに日を選ぶ rnd_hour -> ランダムに消す時間を選ぶ
    def get_delete_time(
        self, rnd_day: int, rnd_hour:int, 
        shift_preference_per_person: list[list[tuple[int, int]]]
    ) -> tuple[int, int]:
        rnd_day = rnd_day % self.days
        edge_num = len(shift_preference_per_person[rnd_day])*2
        edge_num = rnd_hour % edge_num
        pos = shift_preference_per_person[rnd_day][edge_num // 2][edge_num % 2]
        pos_ne = shift_preference_per_person[rnd_day][edge_num // 2][1 - edge_num % 2]
        assert pos_ne != pos
        if edge_num % 2 == 0:
            return (pos, pos + 1)
        else:
            return (pos - 1, pos)
    
    def print(self):
        print("number_of_people_per_time = ")
        print(self.number_of_people_per_time)
        print("number_of_people_per_time_per_attribute = ")
        print(self.number_of_people_per_time_per_attribute)

def get_initial_solutions(
    limit_time_sec : float,
    number_of_people : int,
    number_of_days : int,
    number_of_attributes: int,
    shift_preferences_per_person: list[list[list[tuple[int, int]]]],
    shift_requirements_per_time: list[list[tuple[int, int]]],
    attributes_per_person: list[list[int]],
    attribute_requirements_per_time: list[list[list[tuple[int,int]]]],
    debug: bool
) -> list[list[list[list[tuple[int, int]]]]]:
    assert len(shift_preferences_per_person) == number_of_people
    assert len(shift_requirements_per_time) == number_of_days
    assert len(attributes_per_person) == number_of_people
    assert len(attribute_requirements_per_time) == number_of_days

    start_time = time.perf_counter()
    ret = []

    while time.perf_counter() - start_time < limit_time_sec:
        cur_solution: list[list[list[tuple[int,int]]]] = [[[] for _ in range(number_of_days)] for _ in range(number_of_people)]
        for person_id in range(number_of_people):
            for day, from_to_list in enumerate(shift_preferences_per_person[person_id]):
                for time_interval in from_to_list:
                    cur_solution[person_id][day].append(time_interval)


        cur_state = State(
            number_of_days,
            number_of_attributes,
            shift_preferences_per_person,
            attributes_per_person
        )
        failcnt = 0
        while True:
            if time.perf_counter() - start_time >= limit_time_sec:
                break
            if failcnt > 20:
                failcnt = 0
                if debug:
                    print("--------failed so reset!!!-------")
                break

            rnd_person = random.randint(0,number_of_people-1)
            rnd_day = random.randint(0,number_of_days-1)
            rnd = random.randint(0,len(shift_preferences_per_person[rnd_person][rnd_day])*2 -1)
            if(
                cur_solution[rnd_person][rnd_day][rnd //2][0]
                == cur_solution[rnd_person][rnd_day][rnd//2][1]
            ):
                failcnt += 1
                continue
            (delete_time_start, delete_time_end) = cur_state.get_delete_time(
                rnd_day, rnd, shift_preferences_per_person[rnd_person]
            )
            if cur_state.delete(
                rnd,
                rnd_day,
                delete_time_start,
                delete_time_end,
                attributes_per_person,
                shift_requirements_per_time,
                attribute_requirements_per_time
            ):
                if debug:
                    print("deleted")
                    print("cur_state = ")
                    cur_state.print()
                    print(f"shift_requirements = {shift_requirements_per_time}")
                    print(f"attributes_requirements = {attribute_requirements_per_time}")
                    print(f"cur_solution = {cur_solution}")
                (cur_time_start, cur_time_end) = cur_solution[rnd_person][rnd_day][rnd // 2]
                if rnd % 2 == 0:
                    cur_solution[rnd_person][rnd_day][rnd // 2] = (delete_time_end, cur_time_end)
                else:
                    cur_solution[rnd_person][rnd_day][rnd // 2] = (cur_time_start, delete_time_start)
                
                if cur_state.is_ok(
                    shift_requirements_per_time,
                    attribute_requirements_per_time
                ):
                    if debug:
                        print("ok!")
                    ret.append(cur_solution)
                    break
            else:
                failcnt += 1
    return ret

def test():
    dummy_shift_preferences_per_person: list[list[list[tuple[int, int]]]] = [
        [[(1, 2), (2, 3), (4, 5)]],
        [[(0, 1), (3, 4), (4, 5)]],
        [[(0, 1), (1, 2), (4, 5)]],
        [[(0, 1), (2, 3), (3, 4)]],
        [[(0, 1), (3, 4), (4, 5)]],
        [[(0, 1), (2, 3), (4, 5)]],
        [[(0, 2), (3, 5)]],
    ]
    number_of_days = 1
    number_of_people = 7
    number_of_attributes = 2
    dummy_shift_requirements_per_time: list[list[tuple[int, int]]] =[[
        (2, 4), (2, 4), (2, 4), (2, 4), (2, 4)
    ]+ [(0, 10) for _ in range(43)]]
    dummy_attributes_per_person: list[list[int]] = [[0, 1], [0, 1], [0, 1], [0, 1], [], [], []]
    dummy_attributes_requirements_per_time: list[list[list[tuple[int, int]]]] = [[
        [(1, 2), (1, 2)], [(1, 2), (1, 2)], [(1, 2), (1, 2)], [(1, 2), (1, 2)], [(1, 2), (1, 2)]
    ] + [[(0, 10), (0, 10)] for _ in range(43)]]

    solution = get_initial_solutions(
        0.5,
        number_of_people,
        number_of_days,
        number_of_attributes,
        dummy_shift_preferences_per_person,
        dummy_shift_requirements_per_time,
        dummy_attributes_per_person,
        dummy_attributes_requirements_per_time,
        debug=True,
    )
    print("ans = ")
    print(solution)


if __name__ == "__main__":
    test()