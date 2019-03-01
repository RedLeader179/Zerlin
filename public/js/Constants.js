/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

var PHI = 1.618;

Constants = {

  KeyConstants: {
    MOVE_RIGHT: 'KeyD',
    MOVE_LEFT: 'KeyA',
    CROUCH: 'KeyX',
    JUMP: 'KeyW',
    JUMP_FORCE: 'KeyE',
    SLASH: 'Space',
    ROLL: 'KeyS',
    PAUSE: 'Enter'
  },

  DroidBasicConstants: {
    BASIC_DROID_SHOOT_INTERVAL: 2, //default 2
    BASIC_DROID_X_MOVEMENT_SPEED: 150,
    BASIC_DROID_Y_MOVEMENT_SPEED: 100,
    BASIC_DROID_X_ACCELERATION: 60,
    BASIC_DROID_Y_ACCELERATION: 60,
    BASIC_DROID_ORBITAL_X_OFFSET: 200,
    BASIC_DROID_ORBITAL_Y_OFFSET: -200,
    BASIC_DROID_SCALE: 0.65,

    /* bounding circle scale */
    BASIC_DROID_BOUND_CIRCLE_SCALE: 1.10,

    //Laser constants
    BASIC_DROID_LASER_SPEED: 400,
    BASIC_DROID_LASER_LENGTH: 10,
    BASIC_DROID_LASER_WIDTH: 10,

    /* leggy droid constants */
    LEGGY_DROID_SHOOT_INTERVAL: 4,
    LEGGY_DROID_LASER_SPEED: 350,
    LEGGY_DROID_LASER_LENGTH: 25,
    LEGGY_DROID_LASER_WIDTH: 12,

    /* leggy droid boss constants */
    LEGGY_DROID_BOSS_SHOOT_INTERVAL: .5,

    SPRAY_LASER_COUNT: 5,
    SPRAY_LASER_WIDTH_RADIANS: Math.PI / 6,


    /* beam droid constants */
    BEAM_DROID_SHOOT_INTERVAL: 6,
    BEAM_DROID_SHOOT_DURATION: 2,
    BEAM_DROID_LASER_WIDTH: 16,
    BEAM_HP_PER_SECOND: 3,
    BEAM_ANGLE_ACCELERATION_RADIANS: Math.PI / 3,

    /* slowburst laser constants */
    SLOWBURST_DROID_SHOOT_INTERVAL: .3,
    SLOWBURST_DROID_LASER_SPEED: 350,
    SLOWBURST_DROID_BURSTS: 4,
    // (how many shots are SKIPPED) + BURST_DROID_BURSTS in overall interval
    SLOWBURST_DROID_SHOOTS_PER_CYCLE: 20,

    /* fast burst laser constants */
    FASTBURST_DROID_SHOOT_INTERVAL: .1,
    FASTBURST_DROID_LASER_SPEED: 550,
    FASTBURST_DROID_BURSTS: 3,
    // (how many shots are SKIPPED) + BURST_DROID_BURSTS in overall interval
    FASTBURST_DROID_SHOOTS_PER_CYCLE: 80,

    /* Sniper droid laser constants */
    SNIPER_DROID_LASER_SPEED: 850,
    SNIPER_DROID_SHOOT_INTERVAL: 7,
    SNIPER_DROID_LASER_LENGTH: 50,
    SNIPER_DROID_LASER_WIDTH: 15,

    /* multi-shot laser constants */
    MULTISHOT_DROID_SHOOT_INTERVAL: 2,
    MULTISHOT_WIDTH: 35
  },

  ZerlinConstants: {
    //PHI : 1.618,

    /* Zerlin health and force stats*/
    Z_MAX_HEALTH: 2000, //was 20
    Z_MAX_FORCE: 1000,
    Z_FORCE_REGEN_PER_SECOND: 0.5,
    Z_FORCE_JUMP_FORCE_COST: 3,
    Z_SOMERSAULT_FORCE_COST: 3,
    /* Zerlin damage */
    Z_SLASH_DAMAGE: 10,
    Z_BOSS_BEAM_DAMAGE: 1,

    Z_SCALE: 0.55,

    DRAW_COLLISION_BOUNDRIES: false,

    Z_SPAWN_X: 0, //modify this to spawn zerlin later in the level.
    //about 100 for 1 tile/column.

    Z_WIDTH: 114,
    Z_HEIGHT: 306,
    Z_ARM_SOCKET_X: 33,
    Z_ARM_SOCKET_Y: 146,
    Z_CROUCH_ARM_SOCKET_Y: 186,
    Z_HORIZANTAL_POSITION: 2 - PHI,
    Z_FEET_ABOVE_FRAME: 10,

    Z_WALKING_FRAME_SPEED: .1,
    Z_WALKING_FRAMES: 6,
    Z_STANDING_FRAME_SPEED: .55,
    Z_STANDING_FRAMES: 2,

    Z_FALLING_UP_FRAMES: 1,
    Z_FALLING_DOWN_FRAMES: 2,
    Z_FALLING_FRAME_SPEED: .16,

    Z_SOMERSAULT_WIDTH: 462,
    Z_SOMERSAULT_HEIGHT: 306,
    Z_SOMERSAULT_FRAME_SPEED: .1,
    Z_SOMERSAULT_FRAMES: 10,

    Z_SLASH_WIDTH: 558,
    Z_SLASH_HEIGHT: 390,
    Z_SLASH_FRAME_SPEED: .04,
    Z_SLASH_FRAMES: 20,
    Z_ARM_SOCKET_X_SLASH_FRAME: 69,
    Z_ARM_SOCKET_Y_SLASH_FRAME: 230,
    Z_SLASH_RADIUS: 280,
    Z_SLASH_CENTER_X: 202,
    Z_SLASH_CENTER_Y: 110,
    Z_SLASH_INNER_RADIUS: 180,
    Z_SLASH_INNER_CENTER_X: 86,
    Z_SLASH_INNER_CENTER_Y: 20,
    Z_SLASH_START_FRAME: 9,
    Z_SLASH_END_FRAME: 11,

    Z_DEATH_WIDTH: 414,
    Z_DEATH_FRAMES: 30,


    Z_WALKING_SPEED: 280,
    Z_SOMERSAULT_SPEED: 450,
    FORCE_JUMP_DELTA_Y: -950,
    JUMP_DELTA_Y: -600,
    GRAVITATIONAL_ACCELERATION: 1000,

    LS_UP_IMAGE_WIDTH: 126,
    LS_UP_IMAGE_HEIGHT: 228,
    LS_DOWN_IMAGE_WIDTH: 126,
    LS_DOWN_IMAGE_HEIGHT: 222,

    LS_UP_COLLAR_X: 114, // 114 for outer edge of blade, 111 for center of blade,
    LS_UP_COLLAR_Y: 186,
    LS_DOWN_COLLAR_X: 114,
    LS_DOWN_COLLAR_Y: 35,
    LS_UP_TIP_X: 114,
    LS_UP_TIP_Y: 5,
    LS_DOWN_TIP_X: 114,
    LS_DOWN_TIP_Y: 216,

    LS_RIGHT_X_AXIS: 10,
    LS_LEFT_X_AXIS: 10,
    LS_UP_Y_AXIS: 159,
    LS_DOWN_Y_AXIS: 63
  },

  DroidUtilConstants: {
    EXPLOSION_SCALE: 2,
    EXPLOSION_FRAME_SPEED: 0.05,
    DRAW_BOUNDING_CIRCLE: true
  },

  DroidSmartConstants: {

  },

  GameEngineConstants: {
    //PHI : 1.618
  },

  SceneManagerConstants: {
    OPENING_OVERLAY_TIME: 5,
    OPENING_SCENE_STOP_CAMERA_PAN: 7,
    OPENING_SCENE_FIRST_FADE_OUT_TIME: 10,
    OPENING_MESSAGE: "There is a tremor in the Force on the Dagobah System.\nLegions of mining droids have been unleashed\non the peaceful planet. It's rich core\nof kyber is frail, and the droids are rapidly\ndestroying Dagobah's biosphere.\n\nA lone Jedi dispatched in the outer rim has\nfelt it. A lone warrior against evil...",
    OPENING_MESSAGE_TIME: 10,
    LEVEL_ONE_TEXT: "Here begins a new journey...",
    LEVEL_TRANSITION_TIME: 7,
    LEVEL_TRANSITION_OVERLAY_TIME: 3,
    LEVEL_COMPLETE_OVERLAY_TIME: 10,
    NUM_LEVELS: 1,
    CREDITS: "The End",
    PAUSE_TIME_AFTER_START_LEVEL: 1.2,

    GAME_FONT: 'VT323'
  },

  CollisionManagerConstants: {
    EDGE_OF_MAP_BUFFER: 50
  },

  SoundEnginerConstants: {

  },

  BossConstants: {
    B_MAX_HEALTH: 150,
    BEAM_HP_PER_SECOND: .5,

    B_SCALE: .6,
    B_DRAW_COLLISION_BOUNDRIES: false,
    B_WIDTH: 120,
    B_HEIGHT: 240,
    B_ARM_SOCKET_X: 51,
    B_ARM_SOCKET_Y: 111,
    B_FLYING_FRAME_SPEED: .07,
    B_FLYING_FRAMES: 4,
    B_FALLING_FRAMES: 1,
    B_FALLING_FRAME_SPEED: 1,
    B_SHOOT_INTERVAL: 3,
    B_SHOOT_DURATION: 2,
    B_HOVERING_HEIGHT: 500,
    B_ACCELERATION: 300,
    B_FALLING_REACTION_TIME: .85,
    B_RECOVERY_PERIOD: 2,
    B_BEAM_EXPLOSION_THRESHHOLD: 10,
    BC_WIDTH: 198,
    BC_HEIGHT: 108,
    BC_X_AXIS: 38,
    BC_RIGHT_Y_AXIS: 17,
    BC_LEFT_Y_AXIS: 91,
    BC_MUZZLE_X: 185,
    BC_MUZZLE_RIGHT_Y: 81,
    BC_MUZZLE_LEFT_Y: 27,
    BEAM_DROID_LASER_WIDTH: 26,
    BEAM_HP_PER_SECOND: .3,
    BEAM_ANGLE_ACCELERATION_RADIANS: Math.PI,
    MICRO_BEAM_COUNT: 5,
    MUZZLE_WIDTH: 13,
    MAX_BEAM_LENGTH: 5000
  },

  StatusBarConstants: {
    STATUS_BAR_LENGTH: 0.25, // width of the canvas to use when drawing
    STATUS_BAR_WIDTH: 20,
    STATUS_BAR_DISPLAY_TEXT: false,

    //when the current is less than or equal to the maxSize * CriticalAmount
    //then start alerting the user by using some graphics.
    STATUS_BAR_CRITICAL_AMOUNT: 0.2, //when the current is at 1/5 the maxSize
    STATUS_BAR_CRITICAL_FLASH_INTERVAL: 0.5,
    HEALTH_BAR_HAS_CRITICAL_STATE: true,
    FORCE_BAR_HAS_CRITICAL_STATE: false,

    BOSS_BAR_LENGTH: 0.5,
    BOSS_BAR_HAS_CRITICAL_STATE: false


  },

  CameraConstants: {
    ZERLIN_POSITION_ON_SCREEN: .382, // = (1 - 1/PHI)
    BUFFER: 20
  },

  LevelConstants: {
    DRAW_BOXES: true,
    TILE_ACCELERATION: 200,
    TILE_INITIAL_VELOCITY: 200,

    LEVEL_ONE_TILE_LAYOUT: [
      '                                 ',
      '                                 ',
      '                                 ',
      '                                 ',
      '                                 ',
      '       b                          ',
      ' s            b    --   d     -s  ',
      '     n       -      B    --       s',
      ' d F    m   I   -     d            -',
      '  H   H  B F    --  n                ',
      '  =    F    F     ===        X      ',
      'f   F --   I      --          d     ',
      ' H  -- I    H    -  s    ===   -       ',
      '-------------------------------------'
    ],
    //I think becuase of the powerup scale, they need to be 2 row higher than where you want it.
    //can modify Z_SPAWN_X to make zerlin spawn later in the level.
    MIKE_LEVEL_ONE: [
      '                                                                                          I     d  n                               ',
      '                                    d                                                              f                               ',
      '                                                                    s                        m  d     n                            ',
      '                                        d                                                         f                           I    ',
      '                                  s            d                            s              -   m                                   ',
      '                             d                  f                            n                                                     ',
      '               d                                s         d       s         f b         =                                          ', //from ground can force jump to here.
      '                                                                             d                               ---                   ',
      '                                               f b                          f d        d                              X            ', //halfway of camera height.
      '                          d       d                                        d b           s                  ==                     ',
      '                                           --------                          d                                                     ',
      '                                                                                                                                   ',
      '                  -----                               H                   ---                       H F          --                ',
      '                                       ----                                                                                        ',
      '           ------                             I           -----       ---            -                      ---       --           ', //from ground level, can reg. jump to here.
      '                                 -----             ----                        --                   - -                            ',
      '                                                                            -                                                      ',
      '------------           -- -- ----            --------   --     --- ---------  -- ---- ---------------------------------------------'
    ],
    //   ^      ^- just on screen on start camera location.
    //   |-> Zerlin spawn point.
    //can jump 1 column
    //can roll 2 columns
    CITY_LEVEL: [                                                                                                                                                                                                                                                          // level length
      '                    b                                                                                                                                                     n                          d                                                                                                      ',
      '                                                                                                                                                               m                                               d                                                          s',
      '                                                                                                                                                                                                         m                                    *                            ',
      '                                                                                                                                                                                                                                                                           ',
      '                                                                                                                                                                                                                                                                   f       ',
      '                                                            f                                                                                                                                                                                                               ',
      '                                                                                                                                                                            I                                                                          I                   ', //from ground can force jump to here.
      '                               ~ ~ ~                                                               f                                                                                                                                                                       ',
      '                     *                                                                                                                                                       ~                                                                         ~-~                   ', //halfway of camera height.
      '                                                                            H                                                 d          ==                                                                                                                                X',
      '                       ~               m                                                    b                                                         ---                                                      s                           ----                            ',
      '           s         ~                                                     ~         s                                                        ===                                                                                                                          ',
      '                                    F        ~  ~ ~~                    -~                                                                                                         --                 -                            ~~                 ~--~    ==             ',
      '                ~~                                   H        --    ~~                                                                   --           b              ~~~--~--  H      ---                              ==              ~~--~~                              ',
      '                                    === ==                 -~    ~       ~-    --~---~--          ~~-~              b          -----~-~-                         ~~~~~~                                ---          ~                                      I      ~~~---~~~   ', //from ground level, can reg. jump to here. well higher now
      '    ~                                                ==  =                                                                                               ~~-~                  ==                                               F                                           ',
      '        --~~       --                   d                        ~~~  =  =       H        ~~~~ --    ==~==  ~~       - --------   I                --~                                                                       --    ----   -  ~~~---~~~~------------~~~-------',
      '~~~~ ~-               --   -~   --           --                                                                  ~  --              -                                                       f---------------------   --   --     --                        =       --           '
    ],

    LEVEL_THREE_TILE_LAYOUT: [
      '                 ',
      '           d     ',
      '  d   X          ',
      '          --     ',
      '       d       - ',
      '---              ',
      '   --            ',
      '-----------------'
    ],
    MOVING_TILE_TESTER_LAYOUT: [
      '                 ',
      '                 ',
      '                 ',
      '          --     ',
      '    ==  -      - ',
      '---              ',
      '  ===========    ',
      '-----------------'
    ]

  },

  PowerUpConstants: {
    HEALTH_SCALE: 3,
    RECOVER_HEALTH_AMOUNT: 20,
    RECOVER_FORCE_AMOUNT: 20,
    FORCE_SCALE: 3,
    DRAW_OUTLINES: false,
    FLOATING_MAGNITUDE: 12,
    INVINCIBILITY_SCALE: 2.5,
    INVINCIBILITY_TIME: 10
  }

};
