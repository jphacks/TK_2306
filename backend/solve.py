import get_initial_solution as ini
import transition as trans
import optim as opt

input_ = None

init_sol_time = 1.0

parameters = [1.0, 1.0]

def solve(input_):
    days, workers, attributes, shift_preferences, shift_requirements, workers_attributes, attribute_requirements, min_time, constraints = input_
    candidate = ini.get_initial_solutions(days, workers, attributes, shift_preferences, shift_requirements, workers_attributes, attribute_requirements)
    candidate = trans.trans(days, workers, candidate)
    optimizer = opt.Optimize(days, workers, candidate,
                             shift_preferences,shift_requirements,
                             workers_attributes, min_time, constraints)
    output = optimizer.solve(parameters, init_sol_time)
    return output