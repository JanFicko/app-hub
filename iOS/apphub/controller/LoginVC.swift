//
//  LoginVC.swift
//  apphub
//
//  Created by Jan Ficko on 26/06/2019.
//  Copyright © 2019 Jan Ficko. All rights reserved.
//

import UIKit
import Alamofire
import AlamofireObjectMapper
import SVProgressHUD
import MaterialComponents.MaterialSnackbar

class LoginVC: UIViewController {
    
    let message = MDCSnackbarMessage()
    
    @IBOutlet weak var emailField: UITextField!
    @IBOutlet weak var passwordField: UITextField!
    @IBOutlet weak var loginButton: UIButton!
    @IBOutlet weak var versionLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        versionLabel.text = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String
        
        loginButton.setTitle("Prijava".uppercased(), for: .normal)
    }
    
    @IBAction func onClickLogin(_ sender: UIButton) {
        
        let email = emailField.text
        let password = passwordField.text
        
        if (email != nil && password != nil && !email!.isEmpty && !password!.isEmpty) {
            let emailRegEx = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
            
            let emailTest = NSPredicate(format:"SELF MATCHES %@", emailRegEx)
            if (emailTest.evaluate(with: email)) {
                self.login(email: email!, password: password!)
            } else {
                self.showSnackbar(snackbarMessage: "Nepravilen email")
            }
            
        }
        else {
            self.showSnackbar(snackbarMessage: "Nekatera polja so prazna")
        }
    }
    
    private func login(email : String, password : String) {
        SVProgressHUD.show()
        
        let parameters: [String: Any] = [
            "email" : email,
            "password" : password
            ]
        
        let headers: HTTPHeaders = [
            "Content-Type": "application/json",
            "DeviceInfo": "iOS \(UIDevice.current.systemVersion)/\(UIDevice.current.name)"
        ]
        
        Alamofire.request(
            "http://TODO-SERVICE-URL",
            method: .post,
            parameters: parameters,
            encoding: JSONEncoding.default,
            headers: headers).responseObject { (response: DataResponse<LoginResponse>) in
                
                SVProgressHUD.dismiss()
                
                switch (response.result) {
                case .success:
                    let loginResponse : LoginResponse? = response.result.value
                
                    switch (loginResponse?.code) {
                        case 0:
                            self.navigateToDashboard()
                        case -2:
                            self.showSnackbar(snackbarMessage: "Napačno geslo")
                        case -3:
                            self.showSnackbar(snackbarMessage: "Račun je onemogočen")
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
    
    private func navigateToDashboard() {
        let mainStoryboard = UIStoryboard(name: "Main", bundle: Bundle.main)
        
        guard let mainNavigationVC = mainStoryboard.instantiateViewController(withIdentifier: "idMainNavigation") as? MainNavigationVC else {
            return
        }
        
        present(mainNavigationVC, animated: true, completion: nil)
    }
    
    private func showSnackbar(snackbarMessage : String) {
        message.text = snackbarMessage
        MDCSnackbarManager.show(message)
    }
    
}
