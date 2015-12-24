#clean IDBext094
data <- read.csv("C:/wamp/www/viz/data/IDB_DataSet/IDBext008-semicolon.txt", header=FALSE, sep=";")
colName<-c("stateCode","year","flag","startingAge","ageGroupIndicator","endingAge","bothSexesPopulation","malePopulation","femalePopulation")
colnames(data)<-colName

states <- read.csv("C:/wamp/www/viz/data/IDB_DataSet/IDBextCTYS-semicolon.txt", header=FALSE, sep=";")
nomiCol<-c("stateCode","stateName","area")
colnames(states)<-nomiCol

union<-merge(states,data,by="stateCode")
dataUntil2015<-union[union[,"year"]<=2015,]
write.csv(dataUntil2015, file = "dataUntil2015Groups5Years.csv",row.names=FALSE)
