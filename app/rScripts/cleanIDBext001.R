#############################################
#clean file IDBext001
noSexDinstinction <- read.csv("C:/wamp/www/viz/data/IDB_DataSet/IDBext001-semicolon.txt", header=FALSE, sep=";")
colName<-c("stateCode","year","population")
colnames(noSexDinstinction)<-colName

states <- read.csv("C:/wamp/www/viz/data/IDB_DataSet/IDBextCTYS-semicolon.txt", header=FALSE, sep=";")
nomiCol<-c("stateCode","stateName","area")
colnames(states)<-nomiCol

union<-merge(states,noSexDinstinction,by="stateCode")
dataUntil2015<-union[union[,"year"]<=2015,]

#filter only wanted countries Italy,Brazil,United States
wantedStates<- c("Italy","Brazil","United States")
dataUntil2015<-dataUntil2015[dataUntil2015[,"stateName"] %in% wantedStates,]
write.csv(dataUntil2015, file = "data1950-2015noSexDistinctionFilteredStates.csv",row.names=FALSE)
