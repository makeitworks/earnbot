import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>, 
        @InjectConnection() private readonly connection: Connection, // use for transaction
        
    ) { }

    async findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email }).exec()
    }

    async createUser(email: string, name: string, password: string) {
        return this.userModel.create({ name, email, password });
    }
}
