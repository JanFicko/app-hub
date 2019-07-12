//
//  GetProjectsResponse.swift
//  apphub
//
//  Created by Jan Ficko on 01/07/2019.
//  Copyright © 2019 Jan Ficko. All rights reserved.
//

import ObjectMapper

class GetProjectsResponse : NSObject, Mappable {
    
    var code : Int?
    var projects : [Project]?
    
    override init() {
        super.init()
    }
    
    convenience required init?(map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        code <- map["code"]
        projects <- map["projects"]
    }
    
}

class Project : Mappable {
    var id : String?
    var projectId : Int?
    var icon : String?
    var name : String?
    var path : String?
    var platform : String?
    var jobs : [Job]?
    
    required init?(map: Map){
        
    }
    
    func mapping(map: Map) {
        id <- map["_id"]
        projectId <- map["projectId"]
        icon <- map["icon"]
        name <- map["name"]
        path <- map["path"]
        platform <- map["platform"]
        jobs <- map["jobs"]
    }
    
}

class Job : Mappable {
    var id : String?
    var title : String?
    var changeLog : String?
    var jobId : Int?
    var fullDisplayName : String?
    var name : String?
    var finishTime : String?
    
    required init?(map: Map){
        
    }
    
    func mapping(map: Map) {
        id <- map["_id"]
        title <- map["title"]
        changeLog <- map["changeLog"]
        jobId <- map["jobId"]
        fullDisplayName <- map["fullDisplayName"]
        name <- map["name"]
        finishTime <- map["finishTime"]
    }
    
}
