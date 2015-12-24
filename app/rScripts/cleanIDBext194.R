#cleaning data from https://www.census.gov/population/international/data/idb/region.php
#clead data IDBext194

#import demographic data and add redable col names
data <- read.csv("C:/wamp/www/viz/project1/data/IDB_DataSet/IDBext194-semicolon.txt", header=FALSE, sep=";")
nomiRighe<- c("stateCode","year","sex","maxAge")
ages<-as.character(0:100)
columnNames<-c(nomiRighe,ages)
colnames(data)<-columnNames

#import states code and names and add redable col names
states <- read.csv("C:/wamp/www/viz/project1/data/IDB_DataSet/IDBextCTYS-semicolon.txt", header=FALSE, sep=";")
nomiCol<-c("stateCode","stateName","area")
colnames(states)<-nomiCol

#join the data so that data has the state name instead of the code
#data[,"area"]<-states[states[,"stateCode"] == data[,"area"],"stateName"]
merged<-merge(states,data,by="stateCode")

merged[,"stateName"]<-as.character(merged[,"stateName"])
#italy<-merged[merged[,"stateName"]=="Italy",] #select only those row of italy
#write.csv(merged, file = "allData.csv",row.names=FALSE)

#select only data of 2014
dataUntil2015<-merged[merged[,"year"]==2014,]

#remove stateCode and maxAge
drops <- c("stateCode","maxAge","area")
dataUntil2015<-dataUntil2015[,!(names(dataUntil2015) %in% drops)]

#select wanted states
wantedStates<- c("Italy","Brazil","United States","Vietnam","China","Australia","United Arab Emirates","Afghanistan","Algeria","Argentina","Belgium","Bolivia","Canada","Chile","Colombia","Cuba","Egypt","Ethiopia","Greece","Iceland","Indonesia","India","Iran","Israel","Japan","Iraq","Mexico","Nigeria","Norway","Bosnia and Herzegovina","Kosovo","Poland","South Africa","Sudan","Turkey","Ukraine","Uzbekistan")
dataUntil2015<-dataUntil2015[(dataUntil2015[,"stateName"] %in% wantedStates),]

#change code for man and women to 1 and 2
dataUntil2015[dataUntil2015[,"sex"]==2 , "sex"]<-1
dataUntil2015[dataUntil2015[,"sex"]==3 , "sex"]<-2

#add column with total population at the end
sumOfRows<-rowSums(dataUntil2015[,c(4:104)])
dataUntil2015<-cbind(dataUntil2015,sumOfRows)

#change name of last columsn
names(dataUntil2015)[names(dataUntil2015) == 'sumOfRows'] <- '999'

#sum m+f to obtain total population
sumByState<-aggregate(dataUntil2015[,c(4:105)], by =list(stateName = dataUntil2015$stateName),FUN=sum)

#add year and sex to the calculated sum
year<-data.matrix(rep(2014,nrow(sumByState)))
sex<-data.matrix(rep(0,nrow(sumByState)))
sumByState<-cbind(sex,sumByState)
sumByState<-cbind(year,sumByState)

#add total population to dataUntil2015
dataUntil2015<-rbind(dataUntil2015,sumByState)

write.csv(dataUntil2015, file = "dataof2014sexDistinction.csv",row.names=FALSE)

#select only names of states and save them
ins<-c("stateName")
stati<-dataUntil2015[,(names(dataUntil2015) %in% ins)]

#discover lower bound for year comparisons
#res<-aggregate(year ~ stateName, stati, function(x) min(x))
#lowerBound<-max(res["year"])

#stati<-stati[stati[,"year"]>=lowerBound,]
statiSingle<-unique(stati)
#anni<-unique(stati[,"year"])
write.csv(statiSingle, file = "worldStateNames.csv",row.names=FALSE)
#write.csv(anni, file = "anni.csv",row.names=FALSE)


