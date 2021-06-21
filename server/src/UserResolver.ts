import { createRefreshToken, createAccessToken } from './auth';
import { MyContext } from './MyContext';
import { ObjectType, Field, Ctx, UseMiddleware } from 'type-graphql';
import {Resolver, Query, Mutation, Arg} from 'type-graphql'
import {hash, compare} from 'bcryptjs'
import {User} from './entity/User'
import {isAuth} from './isAuth'
@ObjectType()
class LoginResponse {
    @Field()
    accessToken: String
}
@Resolver()
export class UserResolver {
    @Query(()=> [User])
    users() {
        return User.find()
    }

    @Query(()=> String)
    hello() {
        return "hi!"
    }

    @Query(()=> String)
    @UseMiddleware(isAuth)
    bye(@Ctx() {payload}:MyContext) {
        console.log(payload)
        return `Your user ID is: ${payload!.userId}`
    }

    
    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email:string,
        @Arg('password') password:string,
        @Ctx() {res}: MyContext
        ): Promise<LoginResponse>{
            const user = await User.findOne({where: {email}})
            if(!user){
                throw new Error ("couldn't find user")
            }
            const valid = await compare(password, user.password)

            if(!valid)
            throw new Error ("bad password")

            //login successful
            res.cookie(
                'jid', 
                createRefreshToken(user),
                {
                    httpOnly: true,
                    // domain
                    // path
                }
            )
            return {
                accessToken: createAccessToken(user)
            }
    }

    @Mutation(() => Boolean)
    async register(
        @Arg('email') email:string,
        @Arg('password') password:string,
        ) {
            const hashedPassword = await hash(password, 12)
            try{

                await User.insert({
                    email,
                    password: hashedPassword
                })
            } catch(err) {
                console.log(err)
                return false
            }
        return true
    }
}