//
//  ViewController.swift
//  apphub
//
//  Created by Jan Ficko on 24/06/2019.
//  Copyright © 2019 Jan Ficko. All rights reserved.
//

import UIKit
import Alamofire
import AlamofireObjectMapper
import SVProgressHUD
import MaterialComponents.MaterialSnackbar

class DashboardVC: UITableViewController {
    
    var delegate : OpenJobDelegate?
    let message = MDCSnackbarMessage()
    let userDefaults = UserDefaults.standard
    var itemArray = [String]()
    
    override func viewWillAppear(_ animated: Bool) {
        self.getApps()
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "idAppItemCell", for: indexPath)
        
        let item = itemArray[indexPath.row]
        
        cell.textLabel?.text = item
        
        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        // indexPath.row
        // TODO: Go to next view
        
        tableView.deselectRow(at: indexPath, animated: true)
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return itemArray.count
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if (segue.identifier == "idLogout") {
            userDefaults.set(false, forKey: "LOGGED_IN")
        }
    }
    
    @IBAction func onClickRefresh(_ sender: UIBarButtonItem) {
        self.getApps()
    }
    
    private func getApps() {
        
        SVProgressHUD.show()
        
        let parameters: [String: Any] = [
            "userId" : "5cb9a88edfac10074c260c71",
            "platform" : "ios"
        ]
        
        let headers: HTTPHeaders = [
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1Y2I5YTg4ZWRmYWMxMDA3NGMyNjBjNzEiLCJpYXQiOjE1NjE5NzY3NjksImV4cCI6MTU2MjA2MzE2OX0.RxBS3IF-xoxC0Fe1Yzn4NhhtcueY3EP3TUA6tQPuD_w",
            "DeviceInfo": "iOS \(UIDevice.current.systemVersion)/\(UIDevice.current.name)"
        ]
        
        Alamofire.request(
            "http://172.20.11.35:3000/api/projects/",
            method: .post,
            parameters: parameters,
            encoding: JSONEncoding.default,
            headers: headers).responseObject { (response: DataResponse<GetProjectsResponse>) in
                
                SVProgressHUD.dismiss()
                
                switch (response.result) {
                case .success:
                    let getProjectsResponse : GetProjectsResponse? = response.result.value
                    
                    switch (getProjectsResponse?.code) {
                    case 0:
                        self.itemArray.removeAll()
                        
                        let projects = getProjectsResponse?.projects
                        
                        for project in projects! {
                            self.itemArray.append(project.name!)
                        }
                        
                        self.tableView.reloadData()
                    default:
                        self.showSnackbar(snackbarMessage: "Neznana napaka")
                    }
                    
                case .failure(let error):
                    if (error._code == NSURLErrorNotConnectedToInternet) {
                        self.showSnackbar(snackbarMessage: "Problem z internetno povezavo")
                    } else if (error._code == NSURLErrorTimedOut) {
                        self.showSnackbar(snackbarMessage: "Napaka pri povezavi s strežnikom")
                    } else {
                        self.showSnackbar(snackbarMessage: "Neznana napaka")
                    }
                }
        }
    
    }
    
    private func showSnackbar(snackbarMessage : String) {
        message.text = snackbarMessage
        MDCSnackbarManager.show(message)
    }
    
}

