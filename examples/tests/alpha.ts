/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2023 Comcast Cable Communications Management, LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { ExampleSettings } from '../common/ExampleSettings.js';

export default async function ({ renderer }: ExampleSettings) {
  /*
   * redRect will persist and change color every frame
   * greenRect will persist and be detached and reattached to the root every second
   * blueRect will be created and destroyed every 500 ms
   */

  const parent = renderer.createNode({
    x: 200,
    y: 240,
    width: 500,
    height: 500,
    color: 0x000000ff,
    parent: renderer.root,
    zIndex: 0,
    zIndexLocked: 1,
    alpha: 0.5,
  });

  const child = renderer.createNode({
    x: 800,
    y: 0,
    width: 500,
    height: 500,
    color: 0xff0000ff,
    parent,
    zIndex: 12,
    alpha: 1,
  });

  /*
   * End: Sprite Map Demo
   */
  console.log('ready!');
}
