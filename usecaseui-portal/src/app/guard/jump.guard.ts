import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import { Route } from "@angular/compiler/src/core";
import { menu, address } from "../const/index"
import { environment } from '../../environments/environment'


export class JumpGuard implements CanActivate { 

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let next: boolean = true
        console.log(state.url)
        const target: string = state.url
        console.log('不在该框架')
        // looking for the source of this path
        const menuList: Array<any> = menu.MENU_ITEM
        let source: string = null
        for (let item of menuList) {
            if (item.path === target) {
            source = item.source
            } else {
            for (let val of item.children) { // If you can't find it, recurse deeper
                if (val.path === target) {
                    source = val.source
                }
            }
            }
        }
        if (source === null) { // The source of the path is not recorded in the routing table
            console.log('The source of the path is not recorded in the routing table')
        } else {
            const targetServer = address.ADDRESS[source]
            console.log(targetServer, environment)
            let newUrl: string = ''
            if (environment.production === false) {
                newUrl = `${targetServer}#${target}`
                console.log(newUrl)
            } else { // production
                let baseUrl = window.location.href.split('#')[0]
                newUrl = `${baseUrl}${source}/#${target}`
            }
            next = false
            window.location.href = newUrl
        }
        return next;
    }
}