def cvt_to_react_style(free_time_list):
    key_list = list(free_time_list[0].keys())
    output = []
    for i in range(len(free_time_list)):
        output_comp = []
        for j in range(len(key_list)-1):
            if (free_time_list[i][key_list[j]] == 0 and free_time_list[i][key_list[j+1]] == 1):
                output_comp.append(key_list[j+1][0:5])
            elif (free_time_list[i][key_list[j]] == 1 and free_time_list[i][key_list[j+1]] == 0):
                output_comp.append(key_list[j][6:])
        output.append(output_comp)
    return output
