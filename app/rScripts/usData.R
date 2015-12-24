#cleaning data from http://www.census.gov/popest/data/state/asrh/2014/SC-EST2014-AGESEX-CIV.html

#import
data <- read.csv("C:/wamp/www/viz/project1/app/data/SC-EST2014-AGESEX-CIV-usa states.csv", header=TRUE)

#rename columns
nomiCol<-c("SUMLEV","REGION","DIVISION","STATE","NAME","SEX","AGE","EST","2010","2011","2012","2013","2014")
colnames(data)<-nomiCol

#remove unwanted columns
drops <- c("SUMLEV","REGION","DIVISION","EST","STATE","NAME","SEX","AGE")
data<-data[,!(names(data) %in% drops)]

traspose<-t(data)
newData<-traspose[1:5,1:87]
for(i in 1:155){
  block<-traspose[1:5,(1+87*i):(87+87*i)]
  newData<-rbind(newData,block)
}
#add sex
sexes<-rep(rep(c('0','1','2'),each=5),52)
sexCol<-matrix(sexes,nrow=780,ncol=1)
newData<-cbind(sexCol,newData)

#add year
years<-rep(c('2010','2011','2012','2013','2014'),52)
yearsCol<-matrix(years,nrow=780,ncol=1)
newData<-cbind(yearsCol,newData)

#add state
data <- read.csv("C:/wamp/www/viz/project1/app/data/SC-EST2014-AGESEX-CIV-usa states.csv", header=TRUE)
data<-data[,(names(data) == "NAME")]
k<-matrix(data,nrow=,ncol=1)
k<-unique(k)
k<-rep(k,each=15)
k<-matrix(k,nrow=780,ncol=1)
newData<-cbind(k,newData)

#rename columns
nomiCol<-c("stateName","year","sex")
nomiCol<-append(nomiCol,0:85)
nomiCol<-append(nomiCol,999)

colnames(newData)<-nomiCol

#delete row names
rownames(newData)<-NULL

#take only 2014
newData<-newData[newData[,"year"]=='2014',]

write.csv(newData, file = "usPopulation.csv",row.names=FALSE)
