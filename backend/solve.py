"""
入力:
    10個のデータの組
    (days, workers, attributes, shift_preferences, shift_requirements, workers_attributes, attribute_requirements, min_time, constraints)

    days: int
        予定を決めたい期間の日数
    workers: int
        予定決めに参加している人の人数
    attributes: int
        考慮したい役職の総数
    shift_preferences: list[list[list[tuple[int, int]]]]
        shift_preferences[i][j] で 人 i が j日目にシフトに入れる連続した時間帯の組(a,b)
        の列を返す。ただし(a,b)は半開区間を意図しており、(a,b) in shift_preferences[i][j]であれば、
        人iはj日目の時間aからb-1までの時間シフトに入れることを意味している。
        また、0<=a<b<=48と考えている。
    shift_requirements: list[list[tuple[int, int]]]
        (m,M) = shift_requirements[i][j]のとき、i日目のj時間目には最低でもm人以上、最高でもM人以下でなければならない
    workers_attributes: list[list[int]]
        workers_attributes[i]で人iがもつ役職を表す。
    attributes_requirements: list[list[list[tuple[int, int]]]]
        (m,M) = attributes_requirements[i][j][k]で、
        i日目のj時間目に役職kはm人以上、M人以下である必要がある。
    min_time:
        min_time[i][j] が従事者 i が j 日目に希望する最低労働時間
    constraints:list[tuple[list[int],Parameter_Type]]
        追加の要求を表す。ここで、Parameter_Typeは以下で定義されている
        
        class Parameter_Type:
            workers_concentrate = 0 #働いてる人が同じ日に同じ属性が集中
            workers_scatter = 1
        
        (list, type) = constraints[i] で i番目のパラメータにおける 要求が typeで
        j番目の人のこの属性の値list[j]であることを意味する。   

    
    出力:
        関数 solve の返り値 output:list[list[set[int]]] は
        output[i][j] の指す集合が、i日目のj時間目に働いている人の
        集合を指している。
"""

import get_initial_solution as ini
import transition as trans
import optim as opt

input_ = None

init_sol_time = 1.0

parameters = [1.0, 1.0]

def solve(input_):
    days, workers, attributes, shift_preferences, shift_requirements, workers_attributes, attribute_requirements, min_time, constraints = input_
    candidate = ini.get_initial_solutions(init_sol_time,days, workers, attributes, shift_preferences, shift_requirements, workers_attributes, attribute_requirements)
    candidate = trans.trans(days, workers, candidate)
    optimizer = opt.Optimize(days, workers, candidate,
                             shift_preferences,shift_requirements,
                             workers_attributes, min_time, constraints)
    output = optimizer.solve(parameters, init_sol_time)
    return output