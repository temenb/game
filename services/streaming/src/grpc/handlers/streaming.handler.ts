import * as grpc from '@grpc/grpc-js';
import * as AuthGrpc from '../generated/auth';
import * as ProfileGrpc from '../generated/profile';
import * as AuthService from '../../services/auth.service';
import * as OrchestrationService from '../../services/orchestration.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";
import * as EmptyGrpc from "../generated/common/empty";
import {forwardAuthMetadata} from "../../lib/authMetadata";


