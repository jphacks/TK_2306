import solve

shift_preferences: list[list[list[tuple[int, int]]]] = [
        [[(1, 2), (2, 3), (4, 5)]],
        [[(0, 1), (3, 4), (4, 5)]],
        [[(0, 1), (1, 2), (4, 5)]],
        [[(0, 1), (2, 3), (3, 4)]],
        [[(0, 1), (3, 4), (4, 5)]],
        [[(0, 1), (2, 3), (4, 5)]],
        [[(0, 2), (3, 5)]],
    ]
days = 1
workers = 7
attributes = 2
shift_requirements: list[list[tuple[int, int]]] =[[
    (2, 4), (2, 4), (2, 4), (2, 4), (2, 4)
]+ [(0, 10) for _ in range(43)]]
workers_attributes: list[list[int]] = [[0, 1], [0, 1], [0, 1], [0, 1], [], [], []]
attributes_requirements: list[list[list[tuple[int, int]]]] = [[
    [(1, 2), (1, 2)], [(1, 2), (1, 2)], [(1, 2), (1, 2)], [(1, 2), (1, 2)], [(1, 2), (1, 2)]
] + [[(0, 10), (0, 10)] for _ in range(43)]]
min_time = [[0] for _ in range(days)]
constraints = []

input_ = (days, workers, attributes, shift_preferences,
        shift_requirements, workers_attributes, attributes_requirements,
        min_time, constraints)

print(solve.solve(input_))