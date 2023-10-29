import type_ as ty
import solve

a_shift = [[(36,44)] , [(36,42),(44,48)], [(46,48)]]
b_shift = [[(38,48)], [(38,44)], [(36,48)]]
c_shift = [[(36,42)],[(36,40),(44,48)], [(42,48)]]
d_shift = [[(40,48)], [(38,48)], [(36,44)]]

shift_preferences = [a_shift,b_shift,c_shift,d_shift]
shift_requirements = [
    ([(0,100) for _ in range(36)] + [(2,4) for _ in range(12)])
    for _ in range(3)]
days = 3
workers = 4
attributes = 1
workers_attributes = [[], [], [0], [0]]
min_time = [[0, 0, 0] for _ in range(4)]
attributes_requirements = [[[(0,100)] for _ in range(36)] + [[(1,2)] for _ in range(12)] for _ in range(3)]
constraints =[([1,0,0,1],ty.Parameter_Type.workers_scatter),([0,1,1,0],ty.Parameter_Type.workers_scatter)]

input_ = (days, workers, attributes, shift_preferences,
        shift_requirements, workers_attributes, attributes_requirements,
        min_time, constraints)

out = solve.solve(input_)
solve.output(out,days)