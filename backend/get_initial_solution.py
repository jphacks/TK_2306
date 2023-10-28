import random
import time


# 各時間帯に、現在何人割り当てているのかの状態を表すクラス
class state:
    def __init__(
        self,
        number_of_shifts: int,
        number_of_attributes: int,
        shift_preferences_per_person: list[list[tuple[int, int]]],
        attributes_per_person: list[list[int]],
    ):
        self.number_of_people_per_time = [0] * number_of_shifts
        self.number_of_people_per_time_per_attribute = [
            [0] * number_of_attributes for _ in range(number_of_shifts)
        ]
        for person_id, from_to_list in enumerate(shift_preferences_per_person):
            for from_, to_ in from_to_list:
                for time_ in range(from_, to_):
                    self.number_of_people_per_time[time_] += 1
                    for attribute in attributes_per_person[person_id]:
                        self.number_of_people_per_time_per_attribute[time_][
                            attribute
                        ] += 1

    def is_ok(
        self,
        shift_requirements_per_time: list[tuple[int, int]],
        attribute_requirements_per_time: list[list[tuple[int, int]]],
    ) -> bool:
        for time_, (min_, max_) in enumerate(shift_requirements_per_time):
            if (
                self.number_of_people_per_time[time_] < min_
                or max_ < self.number_of_people_per_time[time_]
            ):
                return False
        for time_, attribute_requirement in enumerate(attribute_requirements_per_time):
            for attribute_id, (min_, max_) in enumerate(attribute_requirement):
                if (
                    self.number_of_people_per_time_per_attribute[time_][attribute_id]
                    < min_
                    or max_
                    < self.number_of_people_per_time_per_attribute[time_][attribute_id]
                ):
                    return False
        return True

    # 消すのに成功したらTrueを返し、実際に消す (消せなかったらFalseを返し、消さない)
    def delete(
        self,
        person_id: int,
        from_: int,
        to_: int,
        attributes_per_person: list[list[int]],
        shift_requirements_per_time: list[tuple[int, int]],
        attribute_requirements_per_time: list[list[tuple[int, int]]],
    ) -> bool:
        assert from_ + 1 == to_
        if (
            self.number_of_people_per_time[from_]
            <= shift_requirements_per_time[from_][0]
        ):
            return False
        for attribute in attributes_per_person[person_id]:
            if (
                self.number_of_people_per_time_per_attribute[from_][attribute]
                <= attribute_requirements_per_time[from_][attribute][0]
            ):
                return False
        self.number_of_people_per_time[from_] -= 1
        for attribute in attributes_per_person[person_id]:
            self.number_of_people_per_time_per_attribute[from_][attribute] -= 1
        return True

    def get_delete_time(
        self, rnd_num: int, shift_preferece_of_person: list[tuple[int, int]]
    ) -> tuple[int, int]:
        # rnd_numから、どの端を消すか決定する
        edge_num = len(shift_preferece_of_person) * 2
        edge_num = rnd_num % edge_num
        pos = shift_preferece_of_person[edge_num // 2][edge_num % 2]
        pos_ne = shift_preferece_of_person[edge_num // 2][1 - edge_num % 2]
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
    limit_time_sec: float,
    number_of_people: int,
    number_of_shifts: int,
    number_of_attributes: int,
    shift_preferences_per_person: list[list[tuple[int, int]]],
    shift_requirements_per_time: list[tuple[int, int]],
    attributes_per_person: list[list[int]],
    attribute_requirements_per_time: list[list[tuple[int, int]]],
    debug = False,
) -> list[list[list[list[int, int]]]]:
    """
    絶対満たすべき条件を満たす初期解を乱択でたくさん生成する

    Parameters
    ----------
    `limit_time_sec : float`
        何秒で打ち切るか
    `number_of_people : int`
        人数
    `number_of_shifts : int`
        時間帯の数
    `number_of_attirbutes: int`
        絶対に満たすべき属性の数
    `shift_preferences_per_person : list[list[tuple[int, int]]]`
        各人の[from, to)の希望(複数を許す)\n
        e.g) `shift_prefernces_per_person[0] = [(1, 2), (3, 5)]` なら0番の人のシフト希望は1番目の時間帯と、3・4番目の時間帯
    `shift_requirements_per_time : list[tuple[int, int]]`
        各時間帯に配置すべき人数の[min,max]\n
        e.g) `shift_requirements_per_time[1] = (2, 4)` なら1番目の時間帯に配置すべき人は2人以上4人以下
    `attributes_per_person : list[list[int]]`
        各人の属性\n
        e.g) `attributes_per_person[1] = [2, 3]` なら1番の人の持つ属性は2と3
    `attribute_requirements_per_time : list[list[tuple[int, int]]]`
        各時間帯について、各属性の人数の[min,max]\n
        e.g) `attributes_requirements_per_time[0] = [[1, 2], [2, 3]]` なら0番目の時間帯で、0番の属性は1人以上2人以下、1番の属性は2人以上3人以下
    """
    assert len(shift_preferences_per_person) == number_of_people
    assert len(shift_requirements_per_time) == number_of_shifts
    assert len(attributes_per_person) == number_of_people
    assert len(attribute_requirements_per_time) == number_of_shifts
    start_time = time.perf_counter()
    ret = []

    while time.perf_counter() - start_time < limit_time_sec:
        cur_solution: list[list[list[int]]] = [[] for _ in range(number_of_people)]
        for person_id, from_to_list in enumerate(shift_preferences_per_person):
            for from_, to_ in from_to_list:
                cur_solution[person_id].append([from_, to_])
        cur_state = state(
            number_of_shifts,
            number_of_attributes,
            shift_preferences_per_person,
            attributes_per_person,
        )
        failcnt = 0
        while True:
            if time.perf_counter() - start_time >= limit_time_sec:
                break
            # 乱択に失敗し続けたらやり直す
            if failcnt > 20:
                failcnt = 0
                if debug:
                    print("--------failed so reset!!!-------")
                break
            # 両端を削っていく
            rnd_person = random.randint(0, number_of_people - 1)
            rnd = random.randint(
                0, len(shift_preferences_per_person[rnd_person]) * 2 - 1
            )
            # もし既にその区間が消しきっていたら、もう一度やり直す
            if (
                cur_solution[rnd_person][rnd // 2][0]
                == cur_solution[rnd_person][rnd // 2][1]
            ):
                failcnt += 1
                continue
            (delete_time_start, delete_time_end) = cur_state.get_delete_time(
                rnd, shift_preferences_per_person[rnd_person]
            )
            if cur_state.delete(
                rnd,
                delete_time_start,
                delete_time_end,
                attributes_per_person,
                shift_requirements_per_time,
                attribute_requirements_per_time,
            ):
                if debug:
                    print("deleted")
                    print("cur_state = ")
                    cur_state.print()
                    print(f"shift_requirements = {shift_requirements_per_time}")
                    print(f"attributes_requirements = {attribute_requirements_per_time}")
                    print(f"cur_solution = {cur_solution}")
                if rnd % 2 == 0:
                    cur_solution[rnd_person][rnd // 2][0] = delete_time_end
                else:
                    cur_solution[rnd_person][rnd // 2][1] = delete_time_start

                # print(f"cur_state = {cur_state.print()}")
                # print(f"cur_solution = {cur_solution}")
                if cur_state.is_ok(
                    shift_requirements_per_time, attribute_requirements_per_time
                ):
                    if debug:
                        print("ok!!!")
                    ret.append(cur_solution)
                    break
            else:
                failcnt += 1
    return ret


def test():
    dummy_shift_preferences_per_person: list[list[tuple[int, int]]] = [
        [(1, 2), (2, 3), (4, 5)],
        [(0, 1), (3, 4), (4, 5)],
        [(0, 1), (1, 2), (4, 5)],
        [(0, 1), (2, 3), (3, 4)],
        [(0, 1), (3, 4), (4, 5)],
        [(0, 1), (2, 3), (4, 5)],
        [(0, 2), (3, 5)],
    ]
    number_of_shifts = 5
    number_of_people = 7
    number_of_attributes = 2
    dummy_shift_requirements_per_time: list[tuple[int, int]] = [
        (2, 4)
    ] * number_of_shifts
    dummy_attributes_per_person: list[list[int]] = [[0, 1], [0, 1], [0, 1], [0, 1], [], [], []]
    dummy_attributes_requirements_per_time: list[list[tuple[int, int]]] = [
        [(1, 2), (1, 2)]
    ] * number_of_shifts

    solution = get_initial_solutions(
        0.5,
        number_of_people,
        number_of_shifts,
        number_of_attributes,
        dummy_shift_preferences_per_person,
        dummy_shift_requirements_per_time,
        dummy_attributes_per_person,
        dummy_attributes_requirements_per_time,
        debug=False,
    )
    print("ans = ")
    print(solution)


if __name__ == "__main__":
    test()
