import * as grpc from '@grpc/grpc-js';
import * as EngineGrpc from '../generated/engine';
import * as HealthGrpc from '../generated//common/health';
import * as EmptyGrpc from '../generated//common/empty';
import * as heathService from '../../services/health.service';
import {callbackError} from './callback.error';

