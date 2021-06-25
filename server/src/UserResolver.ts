import { compare, hash } from "bcryptjs"
import { verify } from "jsonwebtoken"
import {
    Arg,
    Ctx,
    Field,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    UseMiddleware,
} from "type-graphql"
import { getConnection } from "typeorm"
import { createAccessToken, createRefreshToken } from "./auth"
import { User } from "./entity/User"
import { isAuth } from "./isAuth"
import { MyContext } from "./MyContext"
import { sendRefreshToken } from "./sendRefreshToken"
@ObjectType()
class LoginResponse {
    @Field()
    accessToken: String
    @Field(() => User)
    user: User
}
@Resolver()
export class UserResolver {
    @Query(() => [User])
    users() {
        return User.find()
    }

    @Query(() => String)
    hello() {
        return "hi!"
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    bye(@Ctx() { payload }: MyContext) {
        console.log(payload)
        return `Your user ID is: ${payload!.userId}`
    }

    @Query(() => User, { nullable: true })
    me(@Ctx() context: MyContext) {
        const authorization = context.req.headers["authorization"]
        if (!authorization) {
            return null
        }

        try {
            const token = authorization.split(" ")[1]
            const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!)
            return User.findOne(payload.userId)
        } catch (err) {
            console.log(err)
            return null
        }
    }

    @Mutation(() => Boolean)
    async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
        await getConnection()
            .getRepository(User)
            .increment({ id: userId }, "tokenVersion", 1)
        return true
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { res }: MyContext,
    ): Promise<LoginResponse> {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            throw new Error("couldn't find user")
        }
        const valid = await compare(password, user.password)

        if (!valid) throw new Error("bad password")

        //login successful
        sendRefreshToken(res, createRefreshToken(user))

        return {
            accessToken: createAccessToken(user),
            user,
        }
    }

    @Mutation(() => Boolean)
    async register(
        @Arg("email") email: string,
        @Arg("password") password: string,
    ) {
        const hashedPassword = await hash(password, 12)
        try {
            await User.insert({
                email,
                password: hashedPassword,
            })
        } catch (err) {
            console.log(err)
            return false
        }
        return true
    }
    @Mutation(() => Boolean)
    async logout(@Ctx() { res }: MyContext) {
        sendRefreshToken(res, "")
        return true
    }
}
