from datetime import datetime
import math
import random

# Parameter の種類
class Parameter_Type:
    workers_concentrate = 0 #働いてる人が同じ日に同じ属性が集中
    workers_scatter = 1

class Schedule:
    def __init__(self,days:int,workers:int,shift:list[list[set[int]]]):
        self.days = days
        self.workers = workers
        self.shift = shift

class Optimize:
    def __init__(self,days:int,workers:int, #days -> 日数 workers -> 従事者の人数
                candidate:list[list[list[set[int]]]], # candidate -> 解の候補のリスト、candidate[i][j][k] -> i番目の解の候補において、j日目のk時間目に働いている従事者のリスト
                shift_preference:list[list[list[tuple[int,int]]]], # 各人のシフト希望、 shift_preference[i][j] -> 従事者 i の j日目の希望するシフトのリスト、各タプルは半開区間を意図しており、(a,b)はa時からb時前まで
                shift_requirement:list[list[tuple[int,int]]], # (m,M)=shift_requirement[i][j] -> i 日目の j 時間目は m 人以上M人以下必要
                attributes:list[list[int]], # attributes -> 役職 i　をもつ人のリストが attributes[i] 
                attribute_requirement:list[list[list[tuple[int,int]]]], # (m,M)=attribute_requirement[48*i+j][k] で i 日目の j 時間目に役職 k がいるべき人数が m 人以上 M 人以下
                min_time:list[list[int]],  # min_time[i][j] が従事者 i が j 日目に希望する最低労働時間
                constraints:list[tuple[list[int],Parameter_Type]] # (list,type) = constraints[i] とすると、list[j] がパラメータ i　の 従事者 jにおける値、type はパラメータをどのように制御したいか
                ):
        self.days = days
        self.workers = workers
        self.candidate = candidate
        self.shift_preference=shift_preference
        self.shift_requirement = shift_requirement
        self.attributes = attributes
        self.attribute_requirement = attribute_requirement
        self.min_time = min_time
        self.constraints = constraints

        now = datetime.now()
        random.seed(int(now.timestamp()))


    # 返り値は int で sche のシフトにおいて day 日 hour 時に役職 post がいる人数を指す
    def schedule_attribute(self,day,hour,post,sche:Schedule):
        res = 0
        for worker in sche.shift[day][hour]:
            if worker in self.attributes[post]:
                res +=1

        return res
    
    #worker が day 日 hour時には入れるかどうか
    def is_enable(self,worker,day,hour):
        for (a,b) in self.shift_preference[worker][day]:
            if a<=hour<b:
                return True
        else:
            return False
        
    def transition(self, sche:Schedule):
        day = random.randint(0,self.days-1)
        hour = random.randint(0,47)
        workers = sche.shift[day][hour]
        if not bool(workers):
            return Schedule(0,0,[[[]]])
        worker = random.choice(list(workers))
        # 勤務時間の端を探す。日をまたぐケースを想定していないので後で実装すること！
        begin,end=hour,hour
        while begin>0:
            if worker in sche.shift[day][begin-1]:
                begin-=1
            else:
                break
        while end<46:
            if worker in sche.shift[day][end+1]:
                end+=1
            else:
                break

        
        random_bool = random.choice([True,False])
        if random_bool:
            hour = begin
        else:
            hour = end

        enables=[]
        minimum_attributes=[] # worker を除くと人数の縛りを破ってしまう役職一覧
        for post in range(len(self.attributes)):
            if not (worker in self.attributes[post]):
                continue
            (m,_)=self.attribute_requirement[day][hour][worker]
            if m==self.schedule_attribute(day,hour,post,sche):
                minimum_attributes.append(post)
        
        for swap_worker in range(self.workers):
            if swap_worker == worker:
                continue
            if not self.is_enable(swap_worker,day,hour):
                continue
            flag = True
            for post in minimum_attributes:
                if not (swap_worker in self.attributes[post]):
                    flag = False
                    break
            if flag:
                enables.append(swap_worker)

        if minimum_attributes == []:
            enables.append(worker)

        if enables == []:
            return Schedule(0,0,[[[]]])
        
        swap_worker = random.choice(enables)
        shift=sche.shift.copy()
        shift[day][hour].remove(worker)
        if swap_worker != worker:
            shift[day][hour].add(swap_worker)
        return Schedule(self.days,self.workers,shift)
    

    def eval(self, sche:Schedule):
        num_constraints = len(self.constraints)
        score = 0
        for i in range (num_constraints):
            for j in range (sche.days):
                for k in range(48):
                    set1 = sche.shift[j][k]
                    set2 = set(self.constraints[i][0])
                    # 現在のシフトに存在する要素を抽出
                    # difference1 = list(set1 - set2)
                    # 制約にだけ存在する要素を抽出
                    # difference2 = list(set2 - set1)
                    # どちらかのリストにだけ存在する要素を抽出
                    symmetric_difference = set1.symmetric_difference(set2)
                    #両方に存在するリストを抽出
                    common = list(set1.intersection(set2))
                    if self.constraints[i][1] == 0:#同じ日に同じ属性を集中させたい
                        score = score + len(common) - len(symmetric_difference)/2
                    if self.constraints[i][1] == 1:#同じ日に同じ属性を散らしたい
                        score = score - len(common) + len(symmetric_difference)/2
        return score
    # 焼きなまし法の実装
    def simulated_annealing(self,initial_sche:Schedule, initial_temperature, cooling_rate, num_iterations):
        current_sche = initial_sche
        current_score = self.eval(current_sche)
        best_sche = current_sche
        best_score = current_score
        for _ in range(num_iterations):
            # 隣接解を生成
            neighbor_sche= self.transition()
            neighbor_score = self.eval(neighbor_score)
            # エネルギー差を計算
            score_difference = neighbor_score - current_score
            # 確率で受理するか判定
            if  score_difference > 0 or random.random() < math.exp(score_difference / initial_temperature):
                current_sche = neighbor_sche
                current_score = neighbor_score
            # 最良解を更新
            if current_score > best_score:
                best_sche = current_sche
                best_score = current_score
            # 温度を冷却
            initial_temperature *= cooling_rate
        return best_sche, best_score

    def solve(self):
        return
