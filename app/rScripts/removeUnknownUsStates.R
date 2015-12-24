toRemove<-setdiff(usSbagliati,usGiusti) #giusti sono pochi,sbagliati sono di piu
resto<-setdiff(usSbagliati,toRemove)
newUs<-us.state.names[us.state.names[,"name"] %in% resto,]

#write.csv(newUs, file = "us-state-names.tsv",row.names=FALSE)
write.table(newUs, file='us-state-names.tsv', quote=FALSE, sep='\t',row.names=FALSE)
