//
//  SplashVC.swift
//  apphub
//
//  Created by Jan Ficko on 01/07/2019.
//  Copyright © 2019 Jan Ficko. All rights reserved.
//

import UIKit

class SplashVC : UIViewController {
    
    override func viewDidAppear(_ animated: Bool) {
        let storyBoard : UIStoryboard = UIStoryboard(name: "Main", bundle:nil)
        
        if (UserDefaults.standard.bool(forKey: "LOGGED_IN")) {
            guard let mainNavigationVC = storyBoard.instantiateViewController(withIdentifier: "idMainNavigation") as? MainNavigationVC else {
                return
            }
            
            self.present(mainNavigationVC, animated: true, completion: nil)
        }
        else {
            guard let loginVC = storyBoard.instantiateViewController(withIdentifier: "idLogin") as? LoginVC else {
                return
            }
            
            self.present(loginVC, animated:true, completion:nil)
        }
    }
    
}
