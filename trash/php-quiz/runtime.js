var error = function (e, s) {
  document.querySelectorAll('[data-section="error"]').forEach(function (e) {
    if (!s) {
      e.classList.add('hidden');
    } else {
      e.classList.remove('hidden');
    }
  });
}

var tweet = function (type, playedGames, score, lastQuestion) {
  var text = 'ゲームモードは「' + type + '」で，ゲーム回数は「' + playedGames + '回」，スコアは 「' + score + '」 でした！\n あなたは 「' + lastQuestion + '」 を答えられませんでした。\nあなたも PHP の関数名をどれだけ埋められるか試してみませんか？ \nhttps://i.mem.ooo/trash/php-quiz/';
  window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&hashtags=php_quiz');
}

var gotoGoal = function (type, playedGames, before, lastQuestion) {
  var parameter = 1;
  if (type === 'easy') {
    parameter = 0.5;
  }
  if (type === 'hard') {
    parameter = 1;
  }

  if (type === 'crazy') {
    parameter = 1.5;
  }

  var score = Math.ceil(playedGames * parameter);

  var tweetAction = function () {
    tweet(type, playedGames, score, lastQuestion);
  };

  document.querySelector('[data-action="tweet"]').removeEventListener('click', tweetAction);
  document.querySelector('[data-action="tweet"]').addEventListener('click', tweetAction);

  document.querySelectorAll('[data-section="game"]').forEach(function (e) {
    e.classList.add('hidden');
    document.querySelectorAll('[data-section="gameover"]').forEach(function (e) {
      e.classList.remove('hidden');

      e.querySelectorAll('[data-section="your-score"]').forEach(function (e) {
        e.innerText = score;
      });

      e.querySelectorAll('[data-section="your-missing"]').forEach(function (e) {
        e.innerText = lastQuestion;
      });

      e.querySelectorAll('[data-section="your-answered"]').forEach(function (e) {
        if (before.length === 0) {
          before.push('なし');
        }
        e.innerText = before.join(', ');
      });
    });
  })
}

var createFunctionNameAndHiddenPositions = function (type, before, parameter) {
  parameter = parameter || 0;
  var functionNames = Object.keys(functions).filter(function (v) {
    if (type === 'easy') {
      return !v.includes('::');
    }
    return true;
  });

  var targetFunction = functionNames[Math.floor(Math.random() * functionNames.length)];
  if (before.includes(targetFunction)) {
    do {
      targetFunction = functionNames[Math.floor(Math.random() * functionNames.length)];
    } while (before.includes(targetFunction));
  }


  var parameterByType = type === 'crazy'
    ? 100
    : (
      type === 'hard'
        ? 50
        : 0
    )
  var parameterAdjustment = Math.floor(Math.random() * 100) >= parameterByType;

  if (type === 'easy') {
    parameterAdjustment = true;
  }
  if (parameterAdjustment) {
    do {
      var retryChosen = functionNames[Math.floor(Math.random() * functionNames.length)];

      /**
       * This function list created and copy righted by tadsan
       *
       * @see https://github.com/emacs-php/php-mode/blob/master/script/data/module_id_prefixes.php#L56-L491
       */
      if (retryChosen.startsWith('abs') ||
        retryChosen.startsWith('acos') ||
        retryChosen.startsWith('acosh') ||
        retryChosen.startsWith('addcslashes') ||
        retryChosen.startsWith('addslashes') ||
        retryChosen.startsWith('array_') ||
        retryChosen.startsWith('arsort') ||
        retryChosen.startsWith('asin') ||
        retryChosen.startsWith('asinh') ||
        retryChosen.startsWith('asort') ||
        retryChosen.startsWith('assert_options') ||
        retryChosen.startsWith('atan') ||
        retryChosen.startsWith('atan2') ||
        retryChosen.startsWith('atanh') ||
        retryChosen.startsWith('base_convert') ||
        retryChosen.startsWith('base64_') ||
        retryChosen.startsWith('basename') ||
        retryChosen.startsWith('bin2hex') ||
        retryChosen.startsWith('bindec') ||
        retryChosen.startsWith('boolval') ||
        retryChosen.startsWith('call_user_func') ||
        retryChosen.startsWith('call_user_func_array') ||
        retryChosen.startsWith('ceil') ||
        retryChosen.startsWith('chdir') ||
        retryChosen.startsWith('checkdate') ||
        retryChosen.startsWith('checkdnsrr') ||
        retryChosen.startsWith('chgrp') ||
        retryChosen.startsWith('chmod') ||
        retryChosen.startsWith('chop') ||
        retryChosen.startsWith('chown') ||
        retryChosen.startsWith('chr') ||
        retryChosen.startsWith('chroot') ||
        retryChosen.startsWith('chunk_split') ||
        retryChosen.startsWith('class_alias') ||
        retryChosen.startsWith('class_exists') ||
        retryChosen.startsWith('class_implements') ||
        retryChosen.startsWith('class_parents') ||
        retryChosen.startsWith('class_uses') ||
        retryChosen.startsWith('clearstatcache') ||
        retryChosen.startsWith('cli_') ||
        retryChosen.startsWith('closedir') ||
        retryChosen.startsWith('closelog') ||
        retryChosen.startsWith('compact') ||
        retryChosen.startsWith('connection_') ||
        retryChosen.startsWith('constant') ||
        retryChosen.startsWith('convert_cyr_string') ||
        retryChosen.startsWith('convert_uudecode') ||
        retryChosen.startsWith('convert_uuencode') ||
        retryChosen.startsWith('copy') ||
        retryChosen.startsWith('cos') ||
        retryChosen.startsWith('cosh') ||
        retryChosen.startsWith('count') ||
        retryChosen.startsWith('count_chars') ||
        retryChosen.startsWith('crc32') ||
        retryChosen.startsWith('create_function') ||
        retryChosen.startsWith('crypt') ||
        retryChosen.startsWith('ctype_') ||
        retryChosen.startsWith('current') ||
        retryChosen.startsWith('date') ||
        retryChosen.startsWith('date_') ||
        retryChosen.startsWith('debug_') ||
        retryChosen.startsWith('decbin') ||
        retryChosen.startsWith('dechex') ||
        retryChosen.startsWith('decoct') ||
        retryChosen.startsWith('define') ||
        retryChosen.startsWith('defined') ||
        retryChosen.startsWith('deg2rad') ||
        retryChosen.startsWith('delete') ||
        retryChosen.startsWith('die') ||
        retryChosen.startsWith('dir') ||
        retryChosen.startsWith('dirname') ||
        retryChosen.startsWith('disk_') ||
        retryChosen.startsWith('diskfreespace') ||
        retryChosen.startsWith('dl') ||
        retryChosen.startsWith('dns_check_record') ||
        retryChosen.startsWith('dns_get_mx') ||
        retryChosen.startsWith('dns_get_record') ||
        retryChosen.startsWith('doubleval') ||
        retryChosen.startsWith('each') ||
        retryChosen.startsWith('enum_exists') ||
        retryChosen.startsWith('error_') ||
        retryChosen.startsWith('escapeshellarg') ||
        retryChosen.startsWith('escapeshellcmd') ||
        retryChosen.startsWith('eval') ||
        retryChosen.startsWith('exec') ||
        retryChosen.startsWith('exit') ||
        retryChosen.startsWith('exp') ||
        retryChosen.startsWith('explode') ||
        retryChosen.startsWith('expm1') ||
        retryChosen.startsWith('extension_loaded') ||
        retryChosen.startsWith('extract') ||
        retryChosen.startsWith('fastcgi_') ||
        retryChosen.startsWith('fclose') ||
        retryChosen.startsWith('fdatasync') ||
        retryChosen.startsWith('fdiv') ||
        retryChosen.startsWith('feof') ||
        retryChosen.startsWith('fflush') ||
        retryChosen.startsWith('fgetc') ||
        retryChosen.startsWith('fgetcsv') ||
        retryChosen.startsWith('fgets') ||
        retryChosen.startsWith('fgetss') ||
        retryChosen.startsWith('file') ||
        retryChosen.startsWith('filter_') ||
        retryChosen.startsWith('finfo_') ||
        retryChosen.startsWith('floatval') ||
        retryChosen.startsWith('flock') ||
        retryChosen.startsWith('floor') ||
        retryChosen.startsWith('flush') ||
        retryChosen.startsWith('fmod') ||
        retryChosen.startsWith('fnmatch') ||
        retryChosen.startsWith('fopen') ||
        retryChosen.startsWith('forward_static_call') ||
        retryChosen.startsWith('forward_static_call_array') ||
        retryChosen.startsWith('fpassthru') ||
        retryChosen.startsWith('fprintf') ||
        retryChosen.startsWith('fputcsv') ||
        retryChosen.startsWith('fputs') ||
        retryChosen.startsWith('fread') ||
        retryChosen.startsWith('fscanf') ||
        retryChosen.startsWith('fseek') ||
        retryChosen.startsWith('fsockopen') ||
        retryChosen.startsWith('fstat') ||
        retryChosen.startsWith('fsync') ||
        retryChosen.startsWith('ftell') ||
        retryChosen.startsWith('ftruncate') ||
        retryChosen.startsWith('func_get_arg') ||
        retryChosen.startsWith('func_get_args') ||
        retryChosen.startsWith('func_num_args') ||
        retryChosen.startsWith('function_exists') ||
        retryChosen.startsWith('fwrite') ||
        retryChosen.startsWith('gc_') ||
        retryChosen.startsWith('get_') ||
        retryChosen.startsWith('getallheaders') ||
        retryChosen.startsWith('getcwd') ||
        retryChosen.startsWith('getdate') ||
        retryChosen.startsWith('getenv') ||
        retryChosen.startsWith('gethostbyaddr') ||
        retryChosen.startsWith('gethostbyname') ||
        retryChosen.startsWith('gethostbynamel') ||
        retryChosen.startsWith('gethostname') ||
        retryChosen.startsWith('getlastmod') ||
        retryChosen.startsWith('getmxrr') ||
        retryChosen.startsWith('getmygid') ||
        retryChosen.startsWith('getmyinode') ||
        retryChosen.startsWith('getmypid') ||
        retryChosen.startsWith('getmyuid') ||
        retryChosen.startsWith('getopt') ||
        retryChosen.startsWith('getprotobyname') ||
        retryChosen.startsWith('getprotobynumber') ||
        retryChosen.startsWith('getrandmax') ||
        retryChosen.startsWith('getrusage') ||
        retryChosen.startsWith('getservbyname') ||
        retryChosen.startsWith('getservbyport') ||
        retryChosen.startsWith('gettimeofday') ||
        retryChosen.startsWith('gettype') ||
        retryChosen.startsWith('glob') ||
        retryChosen.startsWith('gmdate') ||
        retryChosen.startsWith('gmmktime') ||
        retryChosen.startsWith('gmstrftime') ||
        retryChosen.startsWith('hash') ||
        retryChosen.startsWith('hash_') ||
        retryChosen.startsWith('header') ||
        retryChosen.startsWith('header_register_callback') ||
        retryChosen.startsWith('header_remove') ||
        retryChosen.startsWith('headers_list') ||
        retryChosen.startsWith('headers_sent') ||
        retryChosen.startsWith('hebrev') ||
        retryChosen.startsWith('hebrevc') ||
        retryChosen.startsWith('hex2bin') ||
        retryChosen.startsWith('hexdec') ||
        retryChosen.startsWith('highlight_file') ||
        retryChosen.startsWith('highlight_string') ||
        retryChosen.startsWith('hrtime') ||
        retryChosen.startsWith('html_entity_decode') ||
        retryChosen.startsWith('htmlentities') ||
        retryChosen.startsWith('htmlspecialchars') ||
        retryChosen.startsWith('htmlspecialchars_decode') ||
        retryChosen.startsWith('http_build_query') ||
        retryChosen.startsWith('http_response_code') ||
        retryChosen.startsWith('hypot') ||
        retryChosen.startsWith('idate') ||
        retryChosen.startsWith('ignore_user_abort') ||
        retryChosen.startsWith('implode') ||
        retryChosen.startsWith('in_array') ||
        retryChosen.startsWith('inet_') ||
        retryChosen.startsWith('ini_') ||
        retryChosen.startsWith('intdiv') ||
        retryChosen.startsWith('interface_exists') ||
        retryChosen.startsWith('intval') ||
        retryChosen.startsWith('ip2long') ||
        retryChosen.startsWith('is_a') ||
        retryChosen.startsWith('is_array') ||
        retryChosen.startsWith('is_bool') ||
        retryChosen.startsWith('is_callable') ||
        retryChosen.startsWith('is_countable') ||
        retryChosen.startsWith('is_dir') ||
        retryChosen.startsWith('is_double') ||
        retryChosen.startsWith('is_executable') ||
        retryChosen.startsWith('is_file') ||
        retryChosen.startsWith('is_finite') ||
        retryChosen.startsWith('is_float') ||
        retryChosen.startsWith('is_infinite') ||
        retryChosen.startsWith('is_int') ||
        retryChosen.startsWith('is_integer') ||
        retryChosen.startsWith('is_iterable') ||
        retryChosen.startsWith('is_link') ||
        retryChosen.startsWith('is_long') ||
        retryChosen.startsWith('is_nan') ||
        retryChosen.startsWith('is_null') ||
        retryChosen.startsWith('is_numeric') ||
        retryChosen.startsWith('is_object') ||
        retryChosen.startsWith('is_readable') ||
        retryChosen.startsWith('is_resource') ||
        retryChosen.startsWith('is_scalar') ||
        retryChosen.startsWith('is_string') ||
        retryChosen.startsWith('is_subclass_of') ||
        retryChosen.startsWith('is_uploaded_file') ||
        retryChosen.startsWith('is_writable') ||
        retryChosen.startsWith('is_writeable') ||
        retryChosen.startsWith('iterator_') ||
        retryChosen.startsWith('join') ||
        retryChosen.startsWith('json_') ||
        retryChosen.startsWith('juliantojd') ||
        retryChosen.startsWith('key') ||
        retryChosen.startsWith('key_exists') ||
        retryChosen.startsWith('krsort') ||
        retryChosen.startsWith('ksort') ||
        retryChosen.startsWith('lcfirst') ||
        retryChosen.startsWith('lcg_value') ||
        retryChosen.startsWith('lchgrp') ||
        retryChosen.startsWith('lchown') ||
        retryChosen.startsWith('levenshtein') ||
        retryChosen.startsWith('link') ||
        retryChosen.startsWith('linkinfo') ||
        retryChosen.startsWith('list') ||
        retryChosen.startsWith('localeconv') ||
        retryChosen.startsWith('localtime') ||
        retryChosen.startsWith('log') ||
        retryChosen.startsWith('log10') ||
        retryChosen.startsWith('log1p') ||
        retryChosen.startsWith('long2ip') ||
        retryChosen.startsWith('lstat') ||
        retryChosen.startsWith('ltrim') ||
        retryChosen.startsWith('mail') ||
        retryChosen.startsWith('max') ||
        retryChosen.startsWith('md5') ||
        retryChosen.startsWith('md5_file') ||
        retryChosen.startsWith('memory_') ||
        retryChosen.startsWith('metaphone') ||
        retryChosen.startsWith('method_exists') ||
        retryChosen.startsWith('microtime') ||
        retryChosen.startsWith('mime_content_type') ||
        retryChosen.startsWith('min') ||
        retryChosen.startsWith('mkdir') ||
        retryChosen.startsWith('mktime') ||
        retryChosen.startsWith('money_format') ||
        retryChosen.startsWith('move_uploaded_file') ||
        retryChosen.startsWith('mt_') ||
        retryChosen.startsWith('natcasesort') ||
        retryChosen.startsWith('natsort') ||
        retryChosen.startsWith('net_get_interfaces') ||
        retryChosen.startsWith('next') ||
        retryChosen.startsWith('nl_langinfo') ||
        retryChosen.startsWith('nl2br') ||
        retryChosen.startsWith('number_format') ||
        retryChosen.startsWith('ob_') ||
        retryChosen.startsWith('octdec') ||
        retryChosen.startsWith('opcache_') ||
        retryChosen.startsWith('opendir') ||
        retryChosen.startsWith('openlog') ||
        retryChosen.startsWith('ord') ||
        retryChosen.startsWith('output_') ||
        retryChosen.startsWith('pack') ||
        retryChosen.startsWith('parse_ini_') ||
        retryChosen.startsWith('parse_str') ||
        retryChosen.startsWith('parse_url') ||
        retryChosen.startsWith('passthru') ||
        retryChosen.startsWith('password_') ||
        retryChosen.startsWith('pathinfo') ||
        retryChosen.startsWith('pclose') ||
        retryChosen.startsWith('pfsockopen') ||
        retryChosen.startsWith('php_ini_') ||
        retryChosen.startsWith('php_sapi_name') ||
        retryChosen.startsWith('php_strip_whitespace') ||
        retryChosen.startsWith('php_uname') ||
        retryChosen.startsWith('phpcredits') ||
        retryChosen.startsWith('phpdbg_') ||
        retryChosen.startsWith('phpinfo') ||
        retryChosen.startsWith('phpversion') ||
        retryChosen.startsWith('pi') ||
        retryChosen.startsWith('popen') ||
        retryChosen.startsWith('pos') ||
        retryChosen.startsWith('pow') ||
        retryChosen.startsWith('preg_') ||
        retryChosen.startsWith('prev') ||
        retryChosen.startsWith('print_r') ||
        retryChosen.startsWith('printf') ||
        retryChosen.startsWith('proc_') ||
        retryChosen.startsWith('property_exists') ||
        retryChosen.startsWith('putenv') ||
        retryChosen.startsWith('quoted_printable_') ||
        retryChosen.startsWith('quotemeta') ||
        retryChosen.startsWith('rad2deg') ||
        retryChosen.startsWith('rand') ||
        retryChosen.startsWith('random_') ||
        retryChosen.startsWith('range') ||
        retryChosen.startsWith('rawurldecode') ||
        retryChosen.startsWith('rawurlencode') ||
        retryChosen.startsWith('readdir') ||
        retryChosen.startsWith('readfile') ||
        retryChosen.startsWith('readlink') ||
        retryChosen.startsWith('realpath') ||
        retryChosen.startsWith('realpath_') ||
        retryChosen.startsWith('register_shutdown_function') ||
        retryChosen.startsWith('register_tick_function') ||
        retryChosen.startsWith('rename') ||
        retryChosen.startsWith('reset') ||
        retryChosen.startsWith('restore_') ||
        retryChosen.startsWith('rewind') ||
        retryChosen.startsWith('rewinddir') ||
        retryChosen.startsWith('rmdir') ||
        retryChosen.startsWith('round') ||
        retryChosen.startsWith('rsort') ||
        retryChosen.startsWith('rtrim') ||
        retryChosen.startsWith('sapi_') ||
        retryChosen.startsWith('scandir') ||
        retryChosen.startsWith('seaslog_get_author') ||
        retryChosen.startsWith('seaslog_get_version') ||
        retryChosen.startsWith('serialize') ||
        retryChosen.startsWith('session_') ||
        retryChosen.startsWith('set_') ||
        retryChosen.startsWith('setcookie') ||
        retryChosen.startsWith('setlocale') ||
        retryChosen.startsWith('setrawcookie') ||
        retryChosen.startsWith('settype') ||
        retryChosen.startsWith('sha1') ||
        retryChosen.startsWith('sha1_file') ||
        retryChosen.startsWith('shell_exec') ||
        retryChosen.startsWith('show_source') ||
        retryChosen.startsWith('shuffle') ||
        retryChosen.startsWith('similar_text') ||
        retryChosen.startsWith('sin') ||
        retryChosen.startsWith('sinh') ||
        retryChosen.startsWith('sizeof') ||
        retryChosen.startsWith('sleep') ||
        retryChosen.startsWith('sort') ||
        retryChosen.startsWith('soundex') ||
        retryChosen.startsWith('spl_') ||
        retryChosen.startsWith('sprintf') ||
        retryChosen.startsWith('sqrt') ||
        retryChosen.startsWith('srand') ||
        retryChosen.startsWith('sscanf') ||
        retryChosen.startsWith('stat') ||
        retryChosen.startsWith('str_') ||
        retryChosen.startsWith('strcasecmp') ||
        retryChosen.startsWith('strchr') ||
        retryChosen.startsWith('strcmp') ||
        retryChosen.startsWith('strcoll') ||
        retryChosen.startsWith('strcspn') ||
        retryChosen.startsWith('stream_') ||
        retryChosen.startsWith('strftime') ||
        retryChosen.startsWith('strip_tags') ||
        retryChosen.startsWith('stripcslashes') ||
        retryChosen.startsWith('stripos') ||
        retryChosen.startsWith('stripslashes') ||
        retryChosen.startsWith('stristr') ||
        retryChosen.startsWith('strlen') ||
        retryChosen.startsWith('strnatcasecmp') ||
        retryChosen.startsWith('strnatcmp') ||
        retryChosen.startsWith('strncasecmp') ||
        retryChosen.startsWith('strncmp') ||
        retryChosen.startsWith('strpbrk') ||
        retryChosen.startsWith('strpos') ||
        retryChosen.startsWith('strptime') ||
        retryChosen.startsWith('strrchr') ||
        retryChosen.startsWith('strrev') ||
        retryChosen.startsWith('strripos') ||
        retryChosen.startsWith('strrpos') ||
        retryChosen.startsWith('strspn') ||
        retryChosen.startsWith('strstr') ||
        retryChosen.startsWith('strtok') ||
        retryChosen.startsWith('strtolower') ||
        retryChosen.startsWith('strtotime') ||
        retryChosen.startsWith('strtoupper') ||
        retryChosen.startsWith('strtr') ||
        retryChosen.startsWith('strval') ||
        retryChosen.startsWith('substr') ||
        retryChosen.startsWith('substr_compare') ||
        retryChosen.startsWith('substr_count') ||
        retryChosen.startsWith('substr_replace') ||
        retryChosen.startsWith('symlink') ||
        retryChosen.startsWith('sys_get_temp_dir') ||
        retryChosen.startsWith('sys_getloadavg') ||
        retryChosen.startsWith('syslog') ||
        retryChosen.startsWith('system') ||
        retryChosen.startsWith('tan') ||
        retryChosen.startsWith('tanh') ||
        retryChosen.startsWith('tempnam') ||
        retryChosen.startsWith('time') ||
        retryChosen.startsWith('time_') ||
        retryChosen.startsWith('timezone_') ||
        retryChosen.startsWith('tmpfile') ||
        retryChosen.startsWith('token_get_all') ||
        retryChosen.startsWith('token_name') ||
        retryChosen.startsWith('touch') ||
        retryChosen.startsWith('trait_exists') ||
        retryChosen.startsWith('trigger_error') ||
        retryChosen.startsWith('trim') ||
        retryChosen.startsWith('uasort') ||
        retryChosen.startsWith('ucfirst') ||
        retryChosen.startsWith('ucwords') ||
        retryChosen.startsWith('uksort') ||
        retryChosen.startsWith('umask') ||
        retryChosen.startsWith('uniqid') ||
        retryChosen.startsWith('unlink') ||
        retryChosen.startsWith('unpack') ||
        retryChosen.startsWith('unregister_tick_function') ||
        retryChosen.startsWith('unserialize') ||
        retryChosen.startsWith('unset') ||
        retryChosen.startsWith('urldecode') ||
        retryChosen.startsWith('urlencode') ||
        retryChosen.startsWith('user_error') ||
        retryChosen.startsWith('usleep') ||
        retryChosen.startsWith('usort') ||
        retryChosen.startsWith('var_dump') ||
        retryChosen.startsWith('var_export') ||
        retryChosen.startsWith('version_compare') ||
        retryChosen.startsWith('vfprintf') ||
        retryChosen.startsWith('vprintf') ||
        retryChosen.startsWith('vsprintf') ||
        retryChosen.startsWith('wordwrap') ||
        retryChosen.startsWith('zend_thread_id') ||
        retryChosen.startsWith('zend_version')
      ) {
        if (!before.includes(retryChosen)) {
          targetFunction = retryChosen;
          break;
        }
      }
    } while (true);
  }

  var hiddenCount = Math.max(1, Math.floor(Math.random() * (targetFunction.length * parameter)));
  var remainingHiddenCount = hiddenCount;
  var hiddenPositions = [];

  do {
    var pos = Math.floor(Math.random() * targetFunction.length);
    if (!hiddenPositions.includes(pos) && targetFunction[pos].match(/[A-Za-z0-9]+/)) {
      hiddenPositions.push(pos);
      remainingHiddenCount--;
      if (remainingHiddenCount === 0) {
        break;
      }
    }
  } while (true);

  return [targetFunction, hiddenPositions];
};

var playGame = function (targetFunction, hiddenPositions, type, playedGames, before) {
  before = before || [];
  var timerRemaining = Math.floor((type === 'crazy' ? 8 : 16) / Math.max(1, Math.ceil(Math.log2(playedGames))));
  if (type === 'easy') {
    timerRemaining = 16;
  }
  if (type === 'hard') {
    timerRemaining = Math.max(8, timerRemaining)
  }

  if (type === 'crazy') {
    timerRemaining = Math.max(4, timerRemaining)
  }

  var [nextTargetFunction, nextHiddenPositions] = createFunctionNameAndHiddenPositions(type, before, 0.1 * Math.sqrt(playedGames));

  var contexts = '';

  for (var i = 0, n = 0; i < targetFunction.length; i++) {
    if (hiddenPositions.includes(i)) {
      contexts += '<input data-input-index="' + n + '" class="char" type="text" value="" maxlength="1" />';
      n++;
    } else {
      contexts += '<span class="char">' + targetFunction[i] + '</span>';
    }
  }

  var timerAction = function () {
    document.querySelectorAll('[data-section="remaining-sec"]').forEach(function (e) {
      if (timerRemaining === 0) {
        clearInterval(timerId);
        gotoGoal(type, playedGames, before, targetFunction);
        return;
      }
      e.innerText = timerRemaining;
      timerRemaining--;
    });
  };

  timerAction();
  var timerId = setInterval(timerAction, 1000);
  var beforePushed = 0;


  document.querySelectorAll('[data-section="next-function"]').forEach(function (e) {
    if (type === 'crazy') {
      return;
    }
    var hiddenNextFunction = '';

    for (var i = 0; i < nextTargetFunction.length; i++) {
      if (nextHiddenPositions.includes(i)) {
        hiddenNextFunction += '[_]';
      } else {
        hiddenNextFunction += nextTargetFunction[i];
      }
    }

    e.innerText = hiddenNextFunction;
  });

  document.querySelectorAll('[data-section="display"]').forEach(function (e) {
    e.innerHTML = contexts;
    var wrapper = e;
    error(wrapper, false);
    wrapper.querySelector('input.char[data-input-index="0"]').focus();

    e.querySelectorAll('input.char').forEach(function (e) {
      e.addEventListener('keyup', function (e) {
        var time = e.timeStamp;
        var currentIndex = parseInt(e.target.getAttribute('data-input-index'));
        var chars = '';

        if (e.key === 'Backspace') {
          var prevInput = wrapper.querySelector('input.char[data-input-index="' + (currentIndex - 1) + '"]');
          if (prevInput) {
            prevInput.focus();
            prevInput.value = '';
          }
          e.stopImmediatePropagation();
          return;
        }

        if (e.key === 'Tab' || e.key === 'Process') {
          e.stopImmediatePropagation();
          return;
        }
        if (e.shiftKey || e.metaKey || e.ctrlKey) {
          e.stopImmediatePropagation();
          return;
        }

        for (var i = 0, n = 0; i < targetFunction.length; i++) {
          if (hiddenPositions.includes(i)) {
            chars += wrapper.querySelector('input.char[data-input-index="' + n + '"]').value || '';
            n++;
          } else {
            chars += targetFunction[i];
          }
        }

        if (Object.keys(functions).map(function (name) { return name.toLowerCase() }).includes(chars.toLowerCase())) {
          // Then correct
          clearInterval(timerId);

          playGame(nextTargetFunction, nextHiddenPositions, type, playedGames + 1, before.concat([chars]));
        } else {
          var nextInput = wrapper.querySelector('input.char[data-input-index="' + (currentIndex + 1) + '"]');
          if (nextInput && (time - beforePushed) > 1) {
            nextInput.focus();
          }

          // Not correct
          if (chars.length >= targetFunction.length) {
            wrapper.querySelectorAll('input.char').forEach(function (e) {
              e.value = '';
            });

            error(wrapper, true);

            wrapper.querySelector('input.char[data-input-index="0"]').focus();
          }
        }

        beforePushed = time;
      });
    })
  })
};

document.querySelectorAll('[data-action="play-game"]').forEach(function (e) {
  e.addEventListener('click', function (e) {
    var type = this.getAttribute('data-type');

    document.querySelectorAll('[data-section="first-view"]').forEach(function (e) {
      e.classList.add('hidden');
    });
    document.querySelectorAll('[data-section="game"]').forEach(function (e) {
      e.classList.remove('hidden');

      var [nextTargetFunction, nextHiddenPositions] = createFunctionNameAndHiddenPositions(type, []);
      playGame(nextTargetFunction, nextHiddenPositions, type, 1);
    });
  });
});
