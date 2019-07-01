//
//  LoginResponse.swift
//  apphub
//
//  Created by Jan Ficko on 28/06/2019.
//  Copyright © 2019 Jan Ficko. All rights reserved.
//

import ObjectMapper

class LoginResponse : NSObject, Mappable {
    
    var code : Int?
    var token : String?
    var user : User?
    
    override init() {
        super.init()
    }
    
    convenience required init?(map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        code <- map["code"]
        token <- map["token"]
        user <- map["user"]
    }
    
}

class User : Mappable {
    var id : String?
    var email : String?
    var isAdmin : Bool?
    var isBanned : Bool?
    var registerTime : String?
    
    required init?(map: Map){
        
    }
    
    func mapping(map: Map) {
        id <- map["_id"]
        email <- map["email"]
        isAdmin <- map["isAdmin"]
        isBanned <- map["isBanned"]
        registerTime <- map["registerTime"]
    }
    
}
